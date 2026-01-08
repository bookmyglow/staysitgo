import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { requireSubscription } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = express.Router();

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const expandSearchRadius = (currentLat, currentLon, radiusKm, 
  currentRadius = 10, maxRadius = 100, increment = 10) => {
  return Array.from({ length: maxRadius / increment }, (_, i) => {
    const r = currentRadius + (i * increment);
    const latDelta = r / 111;
    const lonDelta = r / (111 * Math.cos(currentLat * Math.PI / 180));
    
    return {
      latMin: currentLat - latDelta,
      latMax: currentLat + latDelta,
      lonMin: currentLon - lonDelta,
      lonMax: currentLon + lonDelta,
      radius: r
    };
  });
};

router.post('/parent', [
  body('title').trim().isLength({ min: 5, max: 100 }),
  body('description').trim().isLength({ min: 20, max: 1000 }),
  body('petType').isArray().notEmpty(),
  body('startDate').isISO8601().toDate(),
  body('endDate').isISO8601().toDate(),
  body('location').isObject()
], requireSubscription, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, petType, startDate, endDate, location } = req.body;

    const locationRecord = await prisma.location.create({
      data: location
    });

    const listing = await prisma.petParentListing.create({
      data: {
        parentId: req.user.id,
        title,
        description,
        petType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        locationId: locationRecord.id
      },
      include: {
        location: true,
        parent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            verifiedEmail: true,
            verifiedPhone: true,
            verifiedId: true
          }
        }
      }
    });

    res.status(201).json({ listing });
  } catch (error) {
    console.error('Create parent listing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/sitter', [
  body('title').trim().isLength({ min: 5, max: 100 }),
  body('description').trim().isLength({ min: 20, max: 1000 }),
  body('location').isObject(),
  body('services').isArray().notEmpty()
], requireSubscription, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, experience, services, availability, location } = req.body;

    const locationRecord = await prisma.location.create({
      data: location
    });

    const listing = await prisma.petSitterListing.create({
      data: {
        sitterId: req.user.id,
        title,
        description,
        experience,
        services,
        availability: availability || {},
        locationId: locationRecord.id
      },
      include: {
        location: true,
        sitter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            verifiedEmail: true,
            verifiedPhone: true,
            verifiedId: true,
            profile: {
              select: {
                bio: true,
                experience: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({ listing });
  } catch (error) {
    console.error('Create sitter listing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/parent/:id', [
  body('title').optional().trim().isLength({ min: 5, max: 100 }),
  body('description').optional().trim().isLength({ min: 20, max: 1000 }),
  body('petType').optional().isArray().notEmpty(),
  body('startDate').optional().isISO8601().toDate(),
  body('endDate').optional().isISO8601().toDate()
], requireSubscription, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, petType, startDate, endDate, location, status } = req.body;

    const listing = await prisma.petParentListing.findUnique({
      where: { id }
    });

    if (!listing || listing.parentId !== req.user.id) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const updatedListing = await prisma.petParentListing.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(petType && { petType }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(status && { status })
      },
      include: {
        location: true,
        parent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            verifiedEmail: true,
            verifiedPhone: true,
            verifiedId: true
          }
        }
      }
    });

    res.json({ listing: updatedListing });
  } catch (error) {
    console.error('Update parent listing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/sitter/:id', [
  body('title').optional().trim().isLength({ min: 5, max: 100 }),
  body('description').optional().trim().isLength({ min: 20, max: 1000 }),
  body('services').optional().isArray().notEmpty()
], requireSubscription, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, experience, services, availability, status } = req.body;

    const listing = await prisma.petSitterListing.findUnique({
      where: { id }
    });

    if (!listing || listing.sitterId !== req.user.id) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const updatedListing = await prisma.petSitterListing.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(experience && { experience }),
        ...(services && { services }),
        ...(availability && { availability }),
        ...(status && { status })
      },
      include: {
        location: true,
        sitter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            verifiedEmail: true,
            verifiedPhone: true,
            verifiedId: true,
            profile: {
              select: {
                bio: true,
                experience: true
              }
            }
          }
        }
      }
    });

    res.json({ listing: updatedListing });
  } catch (error) {
    console.error('Update sitter listing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:type/:id', requireSubscription, async (req, res) => {
  try {
    const { type, id } = req.params;
    const userId = req.user.id;

    if (type === 'parent') {
      const listing = await prisma.petParentListing.findUnique({
        where: { id }
      });

      if (!listing || listing.parentId !== userId) {
        return res.status(404).json({ error: 'Listing not found' });
      }

      await prisma.petParentListing.update({
        where: { id },
        data: { status: 'DELETED' }
      });
    } else if (type === 'sitter') {
      const listing = await prisma.petSitterListing.findUnique({
        where: { id }
      });

      if (!listing || listing.sitterId !== userId) {
        return res.status(404).json({ error: 'Listing not found' });
      }

      await prisma.petSitterListing.update({
        where: { id },
        data: { status: 'DELETED' }
      });
    } else {
      return res.status(400).json({ error: 'Invalid listing type' });
    }

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q = '', type = 'all', startDate, endDate, latitude, longitude, radius = 50 } = req.query;
    
    const searchParams = {
      where: {
        status: 'ACTIVE',
        OR: [
          { city: { contains: q, mode: 'insensitive' } },
          { state: { contains: q, mode: 'insensitive' } },
          { country: { contains: q, mode: 'insensitive' } }
        ]
      }
    };

    const parentResults = await prisma.petParentListing.findMany({
      where: {
        status: 'ACTIVE',
        startDate: startDate ? { gte: new Date(startDate) } : undefined,
        endDate: endDate ? { lte: new Date(endDate) } : undefined,
        location: searchParams.where
      },
      include: {
        location: true,
        parent: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
            verifiedEmail: true,
            verifiedPhone: true,
            verifiedId: true
          }
        }
      }
    });

    const sitterResults = await prisma.petSitterListing.findMany({
      where: {
        status: 'ACTIVE',
        location: searchParams.where
      },
      include: {
        location: true,
        sitter: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
            verifiedEmail: true,
            verifiedPhone: true,
            verifiedId: true,
            profile: {
              select: {
                bio: true,
                experience: true
              }
            }
          }
        }
      }
    });

    let results = [];
    
    if (type === 'parent' || type === 'all') {
      results = results.concat(
        parentResults.map(listing => ({
          ...listing,
          type: 'parent',
          distance: latitude && longitude ? 
            calculateDistance(latitude, longitude, listing.location.latitude, listing.location.longitude) : 
            null
        }))
      );
    }
    
    if (type === 'sitter' || type === 'all') {
      results = results.concat(
        sitterResults.map(listing => ({
          ...listing,
          type: 'sitter',
          distance: latitude && longitude ? 
            calculateDistance(latitude, longitude, listing.location.latitude, listing.location.longitude) : 
            null
        }))
      );
    }

    if (latitude && longitude) {
      results = results.filter(item => {
        if (item.distance === null) return true;
        return item.distance <= radius;
      });

      results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    if (results.length === 0 && latitude && longitude) {
      const searchAreas = expandSearchRadius(parseFloat(latitude), parseFloat(longitude), 10);
      
      for (const area of searchAreas) {
        const expandedParentResults = await prisma.petParentListing.findMany({
          where: {
            status: 'ACTIVE',
            location: {
              latitude: {
                gte: area.latMin,
                lte: area.latMax
              },
              longitude: {
                gte: area.lonMin,
                lte: area.lonMax
              }
            }
          },
          include: {
            location: true,
            parent: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
                verifiedEmail: true,
                verifiedPhone: true,
                verifiedId: true
              }
            }
          }
        });

        if (expandedParentResults.length > 0) {
          results = expandedParentResults.map(listing => ({
            ...listing,
            type: 'parent',
            distance: calculateDistance(latitude, longitude, listing.location.latitude, listing.location.longitude),
            expandedRadius: area.radius
          }));
          break;
        }
      }
    }

    res.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/my-listings', requireSubscription, async (req, res) => {
  try {
    const parentListings = await prisma.petParentListing.findMany({
      where: {
        parentId: req.user.id,
        status: { not: 'DELETED' }
      },
      include: {
        location: true
      }
    });

    const sitterListings = await prisma.petSitterListing.findMany({
      where: {
        sitterId: req.user.id,
        status: { not: 'DELETED' }
      },
      include: {
        location: true
      }
    });

    res.json({
      parentListings,
      sitterListings
    });
  } catch (error) {
    console.error('Get my listings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;