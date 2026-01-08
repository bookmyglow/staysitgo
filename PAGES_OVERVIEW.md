# StaySitGo - Pages Overview

## Public Pages

### 1. Homepage (/)
**Purpose:** Landing page introducing the platform

**Sections:**
- Hero with headline "Find Trusted Pet Care, Anywhere"
- Platform statistics (10k+ sitters, 50k+ pets, 120+ countries, 4.9★)
- How it works (Search → Connect → Book)
- For Pet Parents section with benefits
- For Pet Sitters section with benefits
- Why Choose StaySitGo (6 benefit cards)
- Pricing preview (Basic vs Premium)
- Final CTA section

**CTAs:**
- Find a Pet Sitter
- Become a Sitter
- Sign Up Free

---

### 2. Find Sitters (/find-sitters)
**Purpose:** Search and browse pet sitters

**Features:**
- Location search bar
- Filter options (pet type, price, distance, rating)
- Verified/Premium only filters
- Sitter cards showing:
  - Name, location, distance
  - Rating and review count
  - Verification badges
  - Pet types
  - Price per day
  - View Profile button
- Sort options (best match, rating, price, distance)

**Mock Data:** 4 sample sitters with different attributes

---

### 3. Find Pet Parents (/find-pet-parents)
**Purpose:** For sitters to find pet parents seeking care

**Features:**
- Location search
- Filter options
- Empty state encouraging search

---

### 4. How It Works (/how-it-works)
**Purpose:** Explain platform usage

**Sections:**
- For Pet Parents (3 steps with icons)
- For Pet Sitters (3 steps with icons)
- Trust & Safety (verification, reviews, support)
- Final CTA

---

### 5. Pricing (/pricing)
**Purpose:** Display membership plans

**Plans:**
1. **Basic (Free)**
   - Create profile and listings
   - Message users
   - Basic search filters
   - Community support
   - Standard placement

2. **Premium ($9.99/month)**
   - Everything in Basic
   - Priority in search
   - Advanced filters & analytics
   - Verified badge
   - 24/7 priority support
   - Unlimited messaging
   - Featured placement

---

### 6. Login (/login)
**Purpose:** User authentication

**Features:**
- Email/password form
- Remember me checkbox
- Forgot password link
- Social login (Google, Facebook)
- Link to sign up

---

### 7. Signup (/signup)
**Purpose:** New user registration

**Features:**
- Name, email, password fields
- Role selection (Pet Parent, Pet Sitter, Both)
- Terms acceptance checkbox
- Social signup options
- Link to login

---

## Protected Pages (User Dashboard Area)

### 8. Dashboard (/dashboard)
**Purpose:** User overview and quick access

**Sections:**
1. **Stats Cards:**
   - Active Listings: 3 (↑ 1 this week)
   - Unread Messages: 5 (2 new today)
   - Upcoming Bookings: 2 (next Jan 15)
   - Profile Views: 127 (↑ 23% this month)

2. **Profile Status:**
   - Email Verified ✓
   - Profile Photo ✓
   - Identity Verification (pending)

3. **Recent Messages:**
   - 3 message previews with unread indicators

4. **Active Listings:**
   - 3 listing cards with type and status

5. **Sidebar:**
   - Profile card with rating
   - Trust & Verification checklist
   - Account status (plan, member since)
   - Help/Support card

---

### 9. Messages (/messages)
**Purpose:** Direct messaging interface

**Layout:**
- **Left Panel:** Conversation list
  - Search messages
  - Conversation cards with unread indicators
  - Last message preview
  - Time stamps

- **Right Panel:** Active conversation
  - Message thread
  - Sender/recipient indicators
  - Send message input

**Mock Data:** 3 conversations with sample messages

---

### 10. Listings (/listings)
**Purpose:** Manage pet care listings

**Features:**
- Create new listing button
- Listing cards showing:
  - Title
  - Type (Offering/Seeking)
  - Status (Active/Inactive)
  - Price per day
  - View count
  - Edit/Delete actions

**Mock Data:** 3 sample listings

---

### 11. Calendar (/calendar)
**Purpose:** Booking and availability management

**Layout:**
- **Main Area:** Month view calendar
  - Navigation (prev/next/today)
  - Day grid with bookings
  - Color coding (available/booked)

- **Sidebar:**
  - Upcoming bookings list
  - Quick actions (Set Availability, View All Bookings)

**Mock Data:** 2 upcoming bookings for January

---

### 12. Profile (/profile)
**Purpose:** User profile display (own or others)

**Left Sidebar:**
- Avatar and basic info
- Rating (4.8 stars, 24 reviews)
- Location
- Trust & verification badges
- Contact information
- Quick stats (response rate, time, completed jobs)

**Main Content:**
- About Me section
- Pet Care Experience
  - Pet types (Dogs, Cats, Birds, Small Pets)
  - Services offered
- Active Listings (2 cards)
- Availability Calendar (placeholder)
- Reviews section (3 sample reviews with ratings)

**Actions:**
- Edit Profile (if own profile)
- Send Message / Book Now (if other's profile)

---

## Navigation Structure

### Public Navigation:
- Home
- Find Sitters
- Find Pet Parents
- How It Works
- Pricing
- Login / Sign Up

### Logged-In Navigation:
- Dashboard
- Messages
- Listings
- Calendar
- Profile
- Logout

### Footer:
- For Pet Parents (Find Sitters, How It Works, Safety)
- For Sitters (Become a Sitter, Resources, Community)
- Company (About, Contact, Terms, Privacy)

---

## Visual Design Elements

### Colors:
- Primary Orange: #ed6f1a (buttons, accents)
- Secondary Blue: #0ba5e9 (alternate CTAs)
- Success Green: For verified badges
- Warning Yellow: For pending items
- Background: Light gray (#f9fafb)

### Components:
- **Cards:** White background, rounded corners, soft shadow
- **Buttons:** Three styles (primary, secondary, outline)
- **Badges:** Rounded pills for status, pet types, etc.
- **Icons:** Lucide React throughout
- **Avatars:** Circular with gradient backgrounds
- **Forms:** Clean inputs with focus states

### Typography:
- Headlines: Bold, large (text-3xl to text-5xl)
- Body: Regular, readable (text-base to text-lg)
- Labels: Medium weight, smaller (text-sm)

### Spacing:
- Consistent padding/margins
- Generous white space
- Mobile-first grid layouts

---

## Responsive Behavior

### Desktop (1024px+):
- Full navigation menu in header
- Multi-column layouts
- Sidebar layouts for dashboard pages

### Tablet (768px - 1023px):
- Adjusted grid columns
- Stacked layouts where needed
- Full navigation visible

### Mobile (< 768px):
- Hamburger menu
- Single column layouts
- Stack all sections vertically
- Touch-friendly buttons and inputs

---

## Interactive States

### Hover Effects:
- Cards: Enhanced shadow
- Buttons: Color darkening
- Links: Color change to primary
- Icons: Color transitions

### Focus States:
- Inputs: Ring with primary color
- Buttons: Ring offset
- Links: Underline or color change

### Active States:
- Navigation: Primary color highlight
- Selected items: Background color change

---

## Empty States

Pages include helpful empty states:
- No search results → Clear filters button
- No listings → Create first listing CTA
- No messages → Encouraging text

---

## Mock Data

All pages use realistic mock data:
- Sample user names and avatars
- Realistic prices ($25-$80/day)
- Believable distances (2-10 miles)
- Rating distributions (4.7-5.0)
- Review text samples
- Pet type variety

This allows full UI testing without backend.

---

**Total Pages:** 12 complete pages
**Total Components:** Navigation, Footer, and reusable elements
**Routes:** All configured and working
**Build Status:** ✅ Successful
**Responsive:** ✅ Mobile-first
**Accessibility:** ✅ Basic compliance
