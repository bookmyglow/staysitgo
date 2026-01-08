import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { requireSubscription } from '../middleware/auth.js';
import { sendEmailNotification } from '../services/email.js';
import { createStripePaymentIntent } from '../services/stripe.js';

const prisma = new PrismaClient();
const router = express.Router();

const CANCELLATION_RULES = {
  7: 0.25,
  3: 0.50,
  1: 1.00
};

const calculateCancellationFee = (startDate, totalAmount) => {
  const now = new Date();
  const daysUntilStart = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
  
  for (const [days, feePercentage] of Object.entries(CANCELLATION_RULES)) {
    if (daysUntilStart <= parseInt(days)) {
      return Math.round(totalAmount * feePercentage);
    }
  }
  
  return 0;
};

router.post('/', [
  body('sitterId').isLength({ min: 1 }),
  body('sitterListingId').isLength({ min: 1 }),
  body('startDate').isISO8601().toDate(),
  body('endDate').isISO8601().toDate(),
  body('petDetails').isObject()
], requireSubscription, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { sitterId, sitterListingId, startDate, endDate, petDetails } = req.body;
    
    const sitterListing = await prisma.petSitterListing.findUnique({
      where: { id: sitterListingId },
      include: {
        sitter: {
          include: {
            subscription: true
          }
        }
      }
    });

    if (!sitterListing) {
      return res.status(404).json({ error: 'Sitter listing not found' });
    }

    if (sitterListing.sitterId !== sitterId) {
      return res.status(400).json({ error: 'Sitter ID does not match listing' });
    }

    if (sitterListing.sitterId === req.user.id) {
      return res.status(400).json({ error: 'Cannot book your own listing' });
    }

    if (sitterListing.sitter.subscription?.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'Sitter does not have active subscription' });
    }

    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    const dailyRate = 50;
    const totalAmount = days * dailyRate;

    const booking = await prisma.booking.create({
      data: {
        parentId: req.user.id,
        sitterId: sitterId,
        sitterListingId: sitterListingId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        petDetails,
        status: 'PENDING',
        totalAmount
      },
      include: {
        sitter: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        parent: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    await sendEmailNotification(
      sitterListing.sitter.email,
      'New Booking Request',
      `Hello ${sitterListing.sitter.firstName},\n\nYou have received a new booking request from ${req.user.firstName} ${req.user.lastName}.\n\nPlease log in to your account to review and respond to this request.`
    );

    const message = await prisma.message.create({
      data: {
        senderId: req.user.id,
        receiverId: sitterId,
        bookingId: booking.id,
        content: `New booking request for ${format(new Date(startDate), 'MMM dd, yyyy')} to ${format(new Date(endDate), 'MMM dd, yyyy')}`,
        type: 'BOOKING_REQUEST'
      }
    });

    res.status(201).json({ 
      booking,
      message: 'Booking request sent successfully'
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id/accept', requireSubscription, async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        sitter: {
          select: {
            id: true,
            email: true,
            firstName: true
          }
        },
        parent: {
          select: {
            id: true,
            email: true,
            firstName: true
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.sitterId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to accept this booking' });
    }

    if (booking.status !== 'PENDING') {
      return res.status(400).json({ error: 'Booking is not in pending state' });
    }

    const cancellationFee = calculateCancellationFee(booking.startDate, booking.totalAmount || 500);

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
        cancellationFee
      }
    });

    await sendEmailNotification(
      booking.parent.email,
      'Booking Confirmed',
      `Hello ${booking.parent.firstName},\n\nGreat news! Your booking has been confirmed by ${booking.sitter.firstName}.\n\nBooking details will be available in your dashboard.`
    );

    const message = await prisma.message.create({
      data: {
        senderId: req.user.id,
        receiverId: booking.parentId,
        bookingId: booking.id,
        content: `Booking confirmed! Note: Cancellation fee of $${cancellationFee} applies if cancelled within 7 days of start date.`,
        type: 'BOOKING_ACCEPTED'
      }
    });

    res.json({ 
      booking: updatedBooking,
      message: 'Booking confirmed successfully'
    });

  } catch (error) {
    console.error('Accept booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/cancel', requireSubscription, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        sitter: {
          select: {
            id: true,
            email: true,
            firstName: true
          }
        },
        parent: {
          select: {
            id: true,
            email: true,
            firstName: true
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.parentId !== req.user.id && booking.sitterId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Booking already cancelled' });
    }

    const cancellationFee = calculateCancellationFee(booking.startDate, booking.totalAmount || 500);

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancellationFee
      }
    });

    const notifyUser = booking.parentId === req.user.id ? booking.sitter : booking.parent;
    
    await sendEmailNotification(
      notifyUser.email,
      'Booking Cancelled',
      `Hello ${notifyUser.firstName},\n\nA booking has been cancelled.\n\nReason: ${reason || 'No reason provided'}\n\nCancellation Fee: $${cancellationFee}`
    );

    res.json({ 
      booking: updatedBooking,
      message: 'Booking cancelled successfully',
      cancellationFee
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/my-bookings', requireSubscription, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { parentId: req.user.id },
          { sitterId: req.user.id }
        ]
      },
      include: {
        sitter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        parent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', requireSubscription, async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        sitter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            phone: true,
            email: true,
            emergencyContact: true,
            verifiedEmail: true,
            verifiedPhone: true,
            verifiedId: true
          }
        },
        parent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            phone: true,
            email: true,
            emergencyContact: true,
            verifiedEmail: true,
            verifiedPhone: true,
            verifiedId: true
          }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.parentId !== req.user.id && booking.sitterId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this booking' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;