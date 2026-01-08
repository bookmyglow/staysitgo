import express from 'express';
import OpenAI from 'openai';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const router = express.Router();

const STAYSITGO_RULES = `
You are an AI assistant for StaySitGo, a pet sitting platform that connects pet parents with pet sitters.

PLATFORM RULES AND POLICIES:

1. USER ROLES
   - Pet Parent: People who need pet sitting services
   - Pet Sitter: People who provide pet sitting services
   - Both: Users who can be both parents and sitters
   - One account per person

2. SUBSCRIPTIONS
   - Basic Plan: $29/month, access to listings, basic search, 10 messages/day
   - Premium Plan: $79/month, unlimited access, priority support, featured placement
   - Users cannot message without active subscription
   - Two-week trial period available

3. PAYMENT & CANCELLATION
   - Cancellation fees apply based on timing:
     * 7+ days before: 25% fee
     * 3-6 days before: 50% fee
     * 1-2 days before: 100% fee
   - No refunds for no-shows
   - Payment processed through Stripe

4. VERIFICATION
   - Email verification required
   - Phone verification via SMS
   - ID document verification by admin
   - Trust badges displayed on profiles:
     * Verified Email: Checkmark icon
     * Verified Phone: Phone icon
     * ID Verified: ID card icon
     * Complete Profile: Green checkmark

5. EMERGENCY CONTACTS
   - Pet parents can add emergency contacts
   - Only visible during confirmed bookings
   - Not shared publicly

6. MESSAGING
   - 1:1 chat only
   - Available only to active subscribers
   - Real-time messaging with Socket.io
   - Email notifications for new messages

7. BOOKING PROCESS
   - Parent sends request
   - Sitter accepts/rejects
   - Status changes to "Confirmed" upon acceptance
   - Card hold for potential cancellation fees
   - Automatic fee calculation, no manual decisions

8. ID VERIFICATION PROCESS
   - User uploads front and back of ID
   - Admin reviews within 24-48 hours
   - Approval/rejection with optional notes
   - Status visible on user profile

9. LISTINGS
   - Pet Parent listings include: location, dates, pet type, description
   - Pet Sitter listings include: location, availability, experience, services
   - Search automatically expands radius if no exact matches
   - Results sorted by distance

10. SEARCH FUNCTIONALITY
    - Search by city, country, or region
    - Automatic radius expansion if no results
    - Distance-based sorting
    - Filter by date availability

11. SUPPORTED LOCATIONS
    - Currently available in major cities and regions
    - Expanding service area regularly
    - Rural areas may have limited results

12. CUSTOMER SUPPORT
    - AI assistant for instant help
    - Email support for complex issues
    - Response time: 24-48 hours
    - Emergency support available for active bookings

IMPORTANT GUIDELINES:

1. NEVER make decisions for users
2. NEVER process cancellations or refunds
3. NEVER override system rules
4. ALWAYS explain policies clearly
5. ALWAYS direct users to human support for decisions
6. ALWAYS maintain friendly, helpful tone
7. ALWAYS respect user privacy
8. NEVER share personal information about other users
9. ALWAYS encourage completing profile verification for safety
10. NEVER provide medical or veterinary advice

When responding:
- Be concise but complete
- Use bullet points for clarity
- Provide actionable steps
- Include relevant links when helpful
- Maintain professional, friendly tone
- If uncertain, direct to human support
- Never hallucinate features or policies
`;

router.post('/chat', [
  body('message').trim().isLength({ min: 1, max: 1000 }),
  body('context').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message, context = [] } = req.body;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: STAYSITGO_RULES
        },
        ...context.map(msg => ({
          role: msg.role || 'user',
          content: msg.content
        })),
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const aiResponse = completion.choices[0].message.content;

    res.json({
      response: aiResponse,
      usage: completion.usage
    });

  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'AI assistant is currently unavailable. Please try again later.' });
  }
});

router.get('/suggestions', async (req, res) => {
  try {
    const { query } = req.query;
    
    const commonQuestions = [
      'How do I create a listing?',
      'What are the subscription plans?',
      'How do I verify my ID?',
      'How much are cancellation fees?',
      'How do I book a pet sitter?',
      'What payment methods are accepted?',
      'How do I cancel my subscription?',
      'What are the requirements to become a pet sitter?',
      'How do I update my profile?',
      'What should I do in an emergency?'
    ];

    const filteredQuestions = commonQuestions.filter(q => 
      q.toLowerCase().includes((query || '').toLowerCase())
    );

    res.json({
      suggestions: filteredQuestions.slice(0, 5)
    });

  } catch (error) {
    console.error('AI suggestions error:', error);
    res.status(200).json({ suggestions: [] });
  }
});

export default router;