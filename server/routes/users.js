import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';

const prisma = new PrismaClient();
const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/avatars/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.get('/profile', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        profile: {
          include: {
            location: true
          }
        },
        emergencyContact: true,
        subscription: true,
        idDocuments: {
          where: {
            status: 'PENDING'
          }
        }
      }
    });

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/profile', [
  body('firstName').optional().trim().isLength({ min: 1 }),
  body('lastName').optional().trim().isLength({ min: 1 }),
  body('bio').optional().trim().isLength({ min: 1 }),
  body('experience').optional().trim().isLength({ min: 1 }),
  body('skills').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, bio, experience, skills, location } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        profile: {
          update: {
            ...(bio && { bio }),
            ...(experience && { experience }),
            ...(skills && { skills }),
            ...(location && {
              location: {
                upsert: {
                  create: location,
                  update: location
                }
              }
            })
          }
        }
      },
      include: {
        profile: {
          include: {
            location: true
          }
        }
      }
    });

    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/emergency-contact', [
  body('name').trim().isLength({ min: 1 }),
  body('phone').isMobilePhone(),
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, email } = req.body;

    const emergencyContact = await prisma.emergencyContact.upsert({
      where: { userId: req.user.id },
      create: {
        userId: req.user.id,
        name,
        phone,
        email
      },
      update: {
        name,
        phone,
        email
      }
    });

    res.json({ emergencyContact });
  } catch (error) {
    console.error('Update emergency contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        avatar: `/uploads/avatars/${req.file.filename}`
      }
    });

    res.json({ avatar: updatedUser.avatar });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/id-verification', upload.fields([
  { name: 'front', maxCount: 1 },
  { name: 'back', maxCount: 1 }
]), async (req, res) => {
  try {
    if (!req.files?.front) {
      return res.status(400).json({ error: 'Front image of ID is required' });
    }

    const frontImagePath = req.files.front[0].path;
    const backImagePath = req.files.back?.[0]?.path;

    const idDocument = await prisma.idDocument.create({
      data: {
        userId: req.user.id,
        frontImage: frontImagePath,
        backImage: backImagePath
      }
    });

    res.json({ 
      message: 'ID documents uploaded successfully',
      document: idDocument 
    });
  } catch (error) {
    console.error('ID verification upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/badges', async (req, res) => {
  try {
    const badges = [];
    
    if (req.user.verifiedEmail) {
      badges.push({ type: 'verifiedEmail', label: 'Verified Email', icon: '✓' });
    }
    
    if (req.user.verifiedPhone) {
      badges.push({ type: 'verifiedPhone', label: 'Verified Phone', icon: '📱' });
    }
    
    if (req.user.verifiedId) {
      badges.push({ type: 'verifiedId', label: 'ID Verified', icon: '🆔' });
    }
    
    const hasCompletedProfile = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        profile: {
          include: {
            location: true
          }
        }
      }
    }).then(user => user.profile?.bio && user.profile?.location);
    
    if (hasCompletedProfile) {
      badges.push({ type: 'completedProfile', label: 'Completed Profile', icon: '✅' });
    }
    
    res.json({ badges });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/change-password', [
  body('currentPassword').isLength({ min: 8 }),
  body('newPassword').isLength({ min: 8 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;