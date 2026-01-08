import { PrismaClient } from '@prisma/client';
import { sendEmailNotification } from '../services/email.js';

const prisma = new PrismaClient();

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('New socket connection:', socket.id);

    socket.on('join_room', ({ userId }) => {
      socket.join(userId);
      console.log(`Socket ${socket.id} joined room: ${userId}`);
    });

    socket.on('send_message', async ({ senderId, receiverId, message, bookingId }) => {
      try {
        const newMessage = await prisma.message.create({
          data: {
            senderId,
            receiverId,
            content: message,
            bookingId: bookingId || null,
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
          sender: newMessage.sender,
          bookingId: newMessage.bookingId
        };

        io.to(receiverId).emit('new_message', messageData);
        io.to(senderId).emit('message_sent', { success: true, message: messageData });

        const receiver = await prisma.user.findUnique({
          where: { id: receiverId },
          select: {
            email: true,
            firstName: true,
            notifications: true
          }
        });

        if (receiver && receiver.notifications?.email) {
          await sendEmailNotification(
            receiver.email,
            'New Message on StaySitGo',
            `Hello ${receiver.firstName}, you have received a new message.\n\nPlease log in to your account to view and respond.`
          );
        }

      } catch (error) {
        console.error('Socket message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('mark_as_read', async ({ messageId, userId }) => {
      try {
        await prisma.message.updateMany({
          where: {
            id: messageId,
            receiverId: userId
          },
          data: {
            isRead: true
          }
        });

        io.to(userId).emit('message_read', { messageId });
      } catch (error) {
        console.error('Mark as read error:', error);
      }
    });

    socket.on('typing', ({ senderId, receiverId, isTyping }) => {
      io.to(receiverId).emit('user_typing', { senderId, isTyping });
    });

    socket.on('join_booking_room', ({ bookingId }) => {
      socket.join(`booking_${bookingId}`);
      console.log(`Socket ${socket.id} joined booking room: booking_${bookingId}`);
    });

    socket.on('booking_status_update', async ({ bookingId, status, userId }) => {
      try {
        const booking = await prisma.booking.update({
          where: { id: bookingId },
          data: { status }
        });

        io.to(`booking_${bookingId}`).emit('booking_updated', { booking });

        const { parentId, sitterId } = booking;
        const otherUserId = userId === parentId ? sitterId : parentId;
        
        io.to(otherUserId).emit('booking_update_notification', {
          message: `Booking ${status}`,
          booking: booking
        });

      } catch (error) {
        console.error('Booking update error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  });

  return io;
};

export const emitToRoom = (io, room, event, data) => {
  io.to(room).emit(event, data);
};

export const broadcastToAll = (io, event, data) => {
  io.emit(event, data);
};