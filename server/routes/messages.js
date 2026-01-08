import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { requireSubscription } from '../middleware/auth.js';
import { io } from '../server.js';
import { sendEmailNotification } from '../services/email.js';

const prisma = new PrismaClient();
const router = express.Router();

router.post('/', [
  body('receiverId').isLength({ min: 1 }),
  body('message').trim().isLength({ min: 1, max: 1000 })
], requireSubscription, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { receiverId, message, bookingId } = req.body;
    
    if (req.user.id === receiverId) {
      return res.status(400).json({ error: 'Cannot send message to yourself' });
    }

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      include: {
        subscription: true
      }
    });

    if (!receiver) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    if (!receiver.subscription || receiver.subscription.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'Receiver does not have active subscription' });
    }

    let booking = null;
    if (bookingId) {
      booking = await prisma.booking.findUnique({
        where: { id: bookingId }
      });
      
      if (!booking || (booking.parentId !== req.user.id && booking.parentId !== receiverId &&
          booking.sitterId !== req.user.id && booking.sitterId !== receiverId)) {
        return res.status(400).json({ error: 'Invalid booking ID' });
      }
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId: req.user.id,
        receiverId,
        bookingId: bookingId || null,
        content: message,
        type: 'TEXT'
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    });

    const messageData = {
      id: newMessage.id,
      senderId: newMessage.senderId,
      receiverId: newMessage.receiverId,
      content: newMessage.content,
      createdAt: newMessage.createdAt,
      sender: newMessage.sender
    };

    io.to(receiverId).emit('new_message', messageData);

    await sendEmailNotification(
      receiver.email,
      'New Message',
      `Hello ${receiver.firstName},\n\nYou have received a new message from ${req.user.firstName} ${req.user.lastName}.\n\nMessage: ${message}\n\nPlease log in to your account to respond.`
    );

    res.status(201).json({ 
      message: 'Message sent successfully',
      data: newMessage 
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/conversations', requireSubscription, async (req, res) => {
  try {
    const conversations = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id },
          { receiverId: req.user.id }
        ]
      },
      distinct: ['senderId', 'receiverId'],
      orderBy: {
        createdAt: 'desc'
      }
    });

    const conversationUsers = conversations.map(msg => 
      msg.senderId === req.user.id ? msg.receiverId : msg.senderId
    ).filter((id, index, arr) => arr.indexOf(id) === index);

    const conversationsWithDetails = await Promise.all(
      conversationUsers.map(async (userId) => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            verifiedEmail: true,
            verifiedPhone: true,
            verifiedId: true,
            role: true
          }
        });

        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: req.user.id, receiverId: userId },
              { senderId: userId, receiverId: req.user.id }
            ]
          },
          orderBy: {
            createdAt: 'desc'
          }
        });

        const unreadCount = await prisma.message.count({
          where: {
            receiverId: req.user.id,
            senderId: userId
          }
        });

        return {
          user,
          lastMessage,
          unreadCount
        };
      })
    );

    res.json({ conversations: conversationsWithDetails });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:userId', requireSubscription, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id, receiverId: userId },
          { senderId: userId, receiverId: req.user.id }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        },
        receiver: {
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
      },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    res.json({
      messages: messages.reverse(),
      hasMore: messages.length >= parseInt(limit)
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;