# StaySitGo - Pet Sitting Platform

A modern, trustworthy web platform connecting pet parents and pet sitters worldwide.

## Features

### For Pet Parents
- Search and find verified pet sitters globally
- Browse detailed sitter profiles with reviews
- Direct messaging with sitters
- Secure booking system
- Real-time updates and communication

### For Pet Sitters
- Create professional profile
- Set your own rates and schedule
- Get discovered by pet parents
- Build reputation through reviews
- Manage bookings and availability

### Platform Features
- Clean, modern SaaS-style UI
- Mobile-first responsive design
- Trust and verification system
- Premium membership options
- Global search with filters
- Calendar management
- Messaging system
- User dashboards

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **Icons:** Lucide React

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── Navigation.tsx
├── pages/           # Page components
│   ├── Home.tsx
│   ├── FindSitters.tsx
│   ├── FindPetParents.tsx
│   ├── HowItWorks.tsx
│   ├── Pricing.tsx
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Dashboard.tsx
│   ├── Messages.tsx
│   ├── Listings.tsx
│   ├── Calendar.tsx
│   └── Profile.tsx
├── types/           # TypeScript type definitions
│   └── index.ts
├── App.tsx          # Main application component
├── main.tsx         # Application entry point
└── index.css        # Global styles and Tailwind imports
```

## Routes

### Public Routes
- `/` - Homepage
- `/find-sitters` - Search for pet sitters
- `/find-pet-parents` - Find pet parents (for sitters)
- `/how-it-works` - Platform explanation
- `/pricing` - Pricing plans
- `/login` - User login
- `/signup` - User registration

### Protected Routes (UI only - no authentication yet)
- `/dashboard` - User dashboard
- `/messages` - Messaging interface
- `/listings` - Manage listings
- `/calendar` - Booking calendar
- `/profile` - User profile

## Design Principles

- **Trust First:** Verification badges, reviews, and transparent profiles
- **User-Friendly:** Clean interface with clear navigation
- **Mobile-First:** Fully responsive on all devices
- **Premium Feel:** Modern SaaS design without corporate complexity
- **Pet-Centric:** Warm colors and friendly tone throughout

## Color Palette

- **Primary (Orange):** #ed6f1a - Trust and warmth
- **Secondary (Blue):** #0ba5e9 - Calm and professional
- **Background:** Light gray (#f9fafb)
- **Accents:** Green for success, Yellow for warnings

## Future Enhancements

This is a UI/UX focused implementation. Backend features to be added:
- User authentication and authorization
- Database integration
- Real messaging system
- Payment processing
- Booking management
- File uploads for photos
- Email notifications
- Search functionality
- Review system
- Calendar synchronization

## License

Proprietary - All rights reserved
