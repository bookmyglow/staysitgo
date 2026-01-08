import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { requireRole } from '../middleware/auth.js';
import { sendEmailNotification } from '../services/email.js';

const prisma = new PrismaClient();
const router = express.Router();
const ADMIN_ROLES = ['ADMIN'];

router.get('/dashboard', requireRole(ADMIN_ROLES), async (req, res) => {
  try {
    const [
      totalUsers,
      totalListings,
      totalBookings,
      pendingVerifications,
      recentBookings,
      recentUsers,
      subscriptionStats
    ] = await Promise.all([
      prisma.user.count(),
      prisma.petParentListing.count({ where: { status: 'ACTIVE' } }) +
        prisma.petSitterListing.count({ where: { status: 'ACTIVE' } }),
      prisma.booking.count(),
      prisma.idDocument.count({ where: { status: 'PENDING' } }),
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          sitter: { select: { firstName: true, lastName: true } },
          parent: { select: { firstName: true, lastName: true } }
        }
      }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true
        }
      }),
      prisma.subscription.groupBy({
        by: ['plan'],
        _count: { plan: true }
      })
    ]);

    res.json({
      dashboard: {
        totalUsers,
        totalListings,
        totalBookings,
        pendingVerifications,
        recentBookings,
        recentUsers,
        subscriptionStats
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/users', requireRole(ADMIN_ROLES), async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      role = '', 
      verified = '' 
    } = req.query;

    const where = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (role) where.role = role;
    if (verified) {
      where.verifiedEmail = verified === 'true';
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        subscription: true,
        _count: {
          select: {
            parentListings: true,
            sitterListings: true,
            bookingsAsParent: true,
            bookingsAsSitter: true
          }
        }
      },
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.user.count({ where });

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/verifications', requireRole(ADMIN_ROLES), async (req, res) => {
  try {
    const { status = 'PENDING' } = req.query;

    const verifications = await prisma.idDocument.findMany({
      where: { status },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ verifications });
  } catch (error) {
    console.error('Admin verifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/verifications/:id', [
  body('status').isIn(['APPROVED', 'REJECTED']),
  body('reviewNotes').optional().trim().isLength({ min: 1 })
], requireRole(ADMIN_ROLES), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, reviewNotes } = req.body;

    const verification = await prisma.idDocument.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true
          }
        }
      }
    });

    if (!verification) {
      return res.status(404).json({ error: 'Verification not found' });
    }

    const updatedVerification = await prisma.$transaction(async (tx) => {
      const verificationUpdate = tx.idDocument.update({
        where: { id },
        data: {
          status,
          reviewNotes,
          reviewedBy: req.user.id
        }
      });

      if (status === 'APPROVED') {
        tx.user.update({
          where: { id: verification.userId },
          data: {
            verifiedId: true
          }
        });
      }

      return verificationUpdate;
    });

    await sendEmailNotification(
      verification.user.email,
      `ID Verification ${status}`,
      `Hello ${verification.user.firstName},\n\nYour ID verification has been ${status.toLowerCase()}.\n\n${reviewNotes ? `Review notes: ${reviewNotes}` : ''}\n\nThank you for using StaySitGo.`
    );

    res.json({ 
      verification: updatedVerification, 
      message: `Verification ${status.toLowerCase()} successfully` 
    });
  } catch (error) {
    console.error('Update verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/listings', requireRole(ADMIN_ROLES), async (req, res) => {
  try {
    const { page = 1, limit = 20, type = 'all', status = '' } = req.query;
    
    let listings = [];
    let total = 0;

    if (type === 'parent' || type === 'all') {
      const [parentListings, parentCount] = await Promise.all([
        prisma.petParentListing.findMany({
          where: {
            status: status || undefined
          },
          include: {
            parent: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            },
            location: true
          },
          take: parseInt(limit) / 2,
          skip: (parseInt(page) - 1) * parseInt(limit) / 2,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.petParentListing.count({
          where: { status: status || undefined }
        })
      ]);
      
      listings = listings.concat(parentListings.map(l => ({ ...l, type: 'parent' })));
      total += parentCount;
    }

    if (type === 'sitter' || type === 'all') {
      const [sitterListings, sitterCount] = await Promise.all([
        prisma.petSitterListing.findMany({
          where: {
            status: status || undefined
          },
          include: {
            sitter: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            },
            location: true
          },
          take: parseInt(limit) / 2,
          skip: (parseInt(page) - 1) * parseInt(limit) / 2,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.petSitterListing.count({
          where: { status: status || undefined }
        })
      ]);
      
      listings = listings.concat(sitterListings.map(l => ({ ...l, type: 'sitter' })));
      total += sitterCount;
    }

    res.json({
      listings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Admin listings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/listings/:type/:id', [
  body('status').isIn(['ACTIVE', 'SUSPENDED', 'DELETED'])
], requireRole(ADMIN_ROLES), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, id } = req.params;
    const { status } = req.body;

    let listing;
    if (type === 'parent') {
      listing = await prisma.petParentListing.update({
        where: { id },
        data: { status }
      });
    } else if (type === 'sitter') {
      listing = await prisma.petSitterListing.update({
        where: { id },
        data: { status }
      });
    } else {
      return res.status(400).json({ error: 'Invalid listing type' });
    }

    res.json({ listing, message: 'Listing status updated successfully' });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/subscriptions', requireRole(ADMIN_ROLES), async (req, res) => {
  try {
    const { page = 1, limit = 20, status = '' } = req.query;

    const where = status ? { status } : {};

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        take: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.subscription.count({ where })
    ]);

    res.json({
      subscriptions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Admin subscriptions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/message-user', [
  body('userId').isLength({ min: 1 }),
  body('subject').trim().isLength({ min: 1, max: 200 }),
  body('message').trim().isLength({ min: 1, max: 1000 })
], requireRole(ADMIN_ROLES), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, subject, message } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await prisma.message.create({
      data: {
        senderId: req.user.id,
        receiverId: userId,
        content: `[ADMIN MESSAGE] ${subject}\n\n${message}\n\nThis message was sent by a StaySitGo administrator.`,
        type: 'TEXT'
      }
    });

    await sendEmailNotification(
      user.email,
      `[StaySitGo Admin] ${subject}`,
      `Hello ${user.firstName},\n\nAn administrator has sent you a message:\n\n${message}\n\nIf you have any questions, please reply to this email or contact support.`
    );

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Admin message user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/support-tickets', requireRole(ADMIN_ROLES), async (req, res) => {
  try {
    const { page = 1, limit = 20, status = '' } = req.query;

    const where = status ? { status } : {};

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        take: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.supportTicket.count({ where })
    ]);

    res.json({
      tickets,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Support tickets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/support-tickets/:id', [
  body('status').isIn(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
], requireRole(ADMIN_ROLES), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status, priority } = req.body;

    const ticket = await prisma.supportTicket.update({
      where: { id },
      data: {
        status,
        priority: priority || undefined
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            email: true
          }
        }
      }
    });

    res.json({ ticket, message: 'Ticket updated successfully' });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/platform-stats', requireRole(ADMIN_ROLES), async (req, res) => {
  try {
    const [
      totalUsers,
      usersByRole,
      totalListings,
      activeListings,
      totalBookings,
      bookingsByStatus,
      totalRevenue,
      avgBookingValue,
      growthRates
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.groupBy({
        by: ['role'],
        _count: { role: true }
      }),
      prisma.petParentListing.count() + prisma.petSitterListing.count(),
      prisma.petParentListing.count({ where: { status: 'ACTIVE' } }) +
        prisma.petSitterListing.count({ where: { status: 'ACTIVE' } }),
      prisma.booking.count(),
      prisma.booking.groupBy({
        by: ['status'],
        _count: { status: true }
      }),
      prisma.subscription.count({
        where: {
          status: 'ACTIVE',
          stripeSubscriptionId: { not: null }
        }
      }).then(count => count * 50),
      prisma.booking.aggregate({
        where: { status: 'CONFIRMED' },
        _avg: { totalAmount: true }
      }),
      getGrowthRates()
    ]);

    res.json({
      stats: {
        totalUsers,
        usersByRole,
        totalListings,
        activeListings,
        totalBookings,
        bookingsByStatus,
        totalRevenue,
        avgBookingValue,
        growthRates
      }
    });
  } catch (error) {
    console.error('Platform stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function getGrowthRates() {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

  const [currentMonthCount, lastMonthCount] = await Promise.all([
    prisma.user.count({
      where: {
        createdAt: { gte: lastMonth }
      }
    }),
    prisma.user.count({
      where: {
        createdAt: { gte: twoMonthsAgo, lt: lastMonth }
      }
    })
  ]);

  const userGrowthRate = lastMonthCount > 0 ? 
    ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100 : 100;

  return { userGrowthRate };
}

export default router;