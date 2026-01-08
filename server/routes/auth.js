import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { sendEmailVerification } from '../services/email.js';
import { sendSmsVerification } from '../services/sms.js';

const prisma = new PrismaClient();
const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

router.post('/signup', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('role').isIn(['PET_PARENT', 'PET_SITTER', 'BOTH']),
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role, firstName, lastName, phone } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(phone ? [{ phone }] : [])
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const emailToken = generateVerificationCode();
    const phoneToken = phone ? generateVerificationCode() : null;

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role,
        firstName,
        lastName,
        phone,
        emailToken,
        phoneToken,
        profile: {
          create: {}
        }
      },
      include: {
        profile: true
      }
    });

    await sendEmailVerification(user.email, emailToken, user.firstName);
    
    if (phone && phoneToken) {
      await sendSmsVerification(phone, phoneToken);
    }

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        verifiedEmail: user.verifiedEmail,
        verifiedPhone: user.verifiedPhone
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: {
          include: {
            location: true
          }
        },
        subscription: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        verifiedEmail: user.verifiedEmail,
        verifiedPhone: user.verifiedPhone,
        verifiedId: user.verifiedId,
        profile: user.profile,
        subscription: user.subscription,
        hasCompletedProfile: !!user.profile?.bio && !!user.profile?.location
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/verify-email', [
  body('token').isLength({ min: 6, max: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token } = req.body;
    
    const user = await prisma.user.findFirst({
      where: { emailToken: token }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verifiedEmail: true,
        emailToken: null
      }
    });

    res.json({ message: 'Email verified successfully' });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/verify-phone', [
  body('token').isLength({ min: 6, max: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token } = req.body;
    
    const user = await prisma.user.findFirst({
      where: { phoneToken: token }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verifiedPhone: true,
        phoneToken: null
      }
    });

    res.json({ message: 'Phone verified successfully' });

  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.verifiedEmail) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    const newToken = generateVerificationCode();
    
    await prisma.user.update({
      where: { id: user.id },
      data: { emailToken: newToken }
    });

    await sendEmailVerification(user.email, newToken, user.firstName);

    res.json({ message: 'Verification email sent' });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        profile: {
          include: {
            location: true
          }
        },
        subscription: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        verifiedEmail: user.verifiedEmail,
        verifiedPhone: user.verifiedPhone,
        verifiedId: user.verifiedId,
        profile: user.profile,
        subscription: user.subscription,
        hasCompletedProfile: !!user.profile?.bio && !!user.profile?.location
      }
    });

  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;