# StaySitGo Backend Server

## Overview
Complete backend implementation for StaySitGo pet sitting platform with authentication, subscriptions, messaging, bookings, and admin features.

## Tech Stack
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **Payments**: Stripe integration
- **Realtime**: Socket.io for messaging
- **Email**: SendGrid for notifications
- **SMS**: Twilio for phone verification
- **AI**: OpenAI for support assistant

## Features Implemented

### 🔐 Authentication & Users
- Email/password signup & login
- JWT token authentication
- Email verification with SendGrid
- Phone verification via SMS (Twilio)
- User roles: Pet Parent, Pet Sitter, Both, Admin
- Profile management
- ID document verification
- Trust badges system
- Emergency contact management

### 💳 Subscriptions & Payments
- Two subscription plans (Basic $29/mo, Premium $79/mo)
- Stripe integration for payments
- Payment method management
- Subscription lifecycle management
- Webhook handling for payment events
- Trial period support

### 📋 Listings
- Pet Parent listings (location, dates, pet types, description)
- Pet Sitter listings (location, availability, experience, services)
- CRUD operations for listings
- Search with automatic radius expansion
- Distance-based sorting
- Location-based search with Mapbox integration ready

### 💬 Messaging System
- 1:1 real-time chat with Socket.io
- Message persistence in database
- Email notifications for new messages
- Typing indicators
- Message read status
- Conversation management
- Active subscription requirement

### 📅 Bookings
- Booking request creation
- Confirmation flow (accept/reject)
- Automatic cancellation fee calculation
- Card hold for cancellations
- Status tracking (Pending, Confirmed, Cancelled, Completed)
- Email notifications for status changes

### 🆔 ID Verification
- Document upload (front & back)
- Admin review queue
- Approval/rejection workflow
- Verification status badges
- Admin dashboard for verification management

### 🤖 AI Support Assistant
- OpenAI GPT-3.5 integration
- Trained on platform rules and FAQs
- Context-aware conversations
- Suggestion system for common questions
- Usage tracking and monitoring

### 📊 Admin Panel
- Platform statistics dashboard
- User management
- Listings overview
- Verification queue management
- Subscription overview
- Support ticket system
- Direct user messaging capability
- Admin activity logging

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/verify-phone` - Phone verification
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/emergency-contact` - Update emergency contact
- `POST /api/users/avatar` - Upload profile picture
- `POST /api/users/id-verification` - Upload ID documents
- `GET /api/users/badges` - Get user trust badges

### Listings
- `POST /api/listings/parent` - Create pet parent listing
- `POST /api/listings/sitter` - Create pet sitter listing
- `GET /api/listings/search` - Search listings
- `GET /api/listings/my-listings` - Get user's listings
- `PUT /api/listings/parent/:id` - Update parent listing
- `PUT /api/listings/sitter/:id` - Update sitter listing
- `DELETE /api/listings/:type/:id` - Delete listing

### Bookings
- `POST /api/bookings` - Create booking request
- `PUT /api/bookings/:id/accept` - Accept booking
- `POST /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversations` - Get user conversations
- `GET /api/messages/:userId` - Get messages with user

### Subscriptions
- `GET /api/subscriptions/plans` - Get subscription plans
- `POST /api/subscriptions/create-subscription` - Create subscription
- `POST /api/subscriptions/cancel-subscription` - Cancel subscription
- `GET /api/subscriptions/my-subscription` - Get user's subscription

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - List all users
- `GET /api/admin/verifications` - ID verification queue
- `PUT /api/admin/verifications/:id` - Update verification status
- `GET /api/admin/listings` - List all listings
- `GET /api/admin/subscriptions` - Subscription overview
- `POST /api/admin/message-user` - Send message to user
- `GET /api/admin/support-tickets` - Support tickets

### AI Assistant
- `POST /api/ai/chat` - Chat with AI assistant
- `GET /api/ai/suggestions` - Get AI suggestions

## Environment Variables

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/staysitgo?schema=public"

# Authentication
JWT_SECRET="your-jwt-secret-key-here"
JWT_EXPIRES_IN="7d"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_key"
STRIPE_WEBHOOK_SECRET="whsec_your_secret"

# SendGrid
SENDGRID_API_KEY="SG.your_key"
SENDGRID_FROM_EMAIL="noreply@staysitgo.com"

# Twilio
TWILIO_ACCOUNT_SID="your_account_sid"
TWILIO_AUTH_TOKEN="your_auth_token"
TWILIO_PHONE_NUMBER="+1234567890"

# OpenAI
OPENAI_API_KEY="sk_your_key"

# File Uploads
MAX_FILE_SIZE=5242880
UPLOAD_PATH="./uploads"

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend
FRONTEND_URL=http://localhost:5173
```

## Setup & Installation

1. **Install dependencies:**
   ```bash
   cd server && npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Set up database:**
   ```bash
   npx prisma db push
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

5. **Run database studio:**
   ```bash
   npm run db:studio
   ```

## Project Structure

```
server/
├── prisma/
│   └── schema.prisma      # Database schema
├── routes/                # API route handlers
│   ├── auth.js           # Authentication
│   ├── users.js          # User management
│   ├── listings.js       # Listing CRUD & search
│   ├── bookings.js       # Booking management
│   ├── messages.js       # Messaging system
│   ├── subscriptions.js  # Subscriptions & payments
│   ├── admin.js          # Admin panel
│   └── ai.js             # AI assistant
├── middleware/           # Custom middleware
│   └── auth.js          # JWT authentication
├── services/             # External services
│   ├── email.js         # SendGrid integration
│   └── stripe.js        # Stripe integration
├── socket/              # Real-time features
│   └── handlers.js      # Socket.io handlers
├── uploads/             # File storage
├── .env.example         # Environment template
├── package.json
└── server.js            # Main server file
```

## Security Features
- JWT authentication
- Rate limiting on all routes
- Input validation with express-validator
- CORS configuration
- Helmet for security headers
- File upload size limits
- SQL injection prevention via Prisma
- XSS protection

## Real-time Features
- Socket.io for instant messaging
- Typing indicators
- Message read receipts
- Booking status updates
- Live notifications

## Performance Optimization
- Database indexing on frequently queried fields
- Pagination for large result sets
- Efficient distance calculations
- Connection pooling
- Redis ready for caching layer

## Future Enhancements
- Redis caching for improved performance
- Background job processing with BullMQ
- Advanced search with Elasticsearch
- Mobile push notifications
- SMS notifications
- Calendar integration
- Review and rating system
- Insurance integration
- Multi-language support
