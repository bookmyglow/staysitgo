import express from 'express';
import Stripe from 'stripe';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { requireSubscription } from '../middleware/auth.js';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

const PLAN_PRICES = {
  BASIC: 'price_basic_plan',
  PREMIUM: 'price_premium_plan'
};

const PLAN_FEATURES = {
  BASIC: {
    monthly: 29,
    features: [
      'Access to listings',
      'Basic search',
      'Up to 10 messages per day',
      'Basic support'
    ]
  },
  PREMIUM: {
    monthly: 79,
    features: [
      'Unlimited listings access',
      'Advanced search filters',
      'Unlimited messaging',
      'Priority support',
      'Featured listing placement',
      'Insurance coverage'
    ]
  }
};

router.get('/plans', async (req, res) => {
  try {
    const plans = {
      basic: PLAN_FEATURES.BASIC,
      premium: PLAN_FEATURES.PREMIUM
    };
    
    res.json({ plans });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/create-subscription', [
  body('plan').isIn(['BASIC', 'PREMIUM']),
  body('paymentMethodId').isLength({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { plan, paymentMethodId } = req.body;
    
    let customer = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        subscription: true
      }
    });

    // Check for existing active subscription
    if (customer.subscription && customer.subscription.status === 'ACTIVE') {
      return res.status(400).json({ error: 'Active subscription already exists' });
    }

    // Create or get Stripe customer
    let stripeCustomer;
    if (customer.subscription?.stripeCustomerId) {
      stripeCustomer = await stripe.customers.retrieve(customer.subscription.stripeCustomerId);
    } else {
      stripeCustomer = await stripe.customers.create({
        email: customer.email,
        name: `${customer.firstName} ${customer.lastName}`,
        metadata: {
          userId: req.user.id
        }
      });
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomer.id
    });

    // Set as default payment method
    await stripe.customers.update(stripeCustomer.id, {
      invoice_settings: {
        default_payment_method: paymentMethodId
      }
    });

    // Create subscription
    const stripeSubscription = await stripe.subscriptions.create({
      customer: stripeCustomer.id,
      items: [
        {
          price: PLAN_PRICES[plan]
        }
      ],
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId: req.user.id,
        plan: plan
      }
    });

    // Store subscription in database
    const subscription = await prisma.subscription.upsert({
      where: {
        userId: req.user.id
      },
      update: {
        plan: plan,
        status: 'ACTIVE',
        stripeCustomerId: stripeCustomer.id,
        stripeSubscriptionId: stripeSubscription.id,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000)
      },
      create: {
        userId: req.user.id,
        plan: plan,
        status: 'ACTIVE',
        stripeCustomerId: stripeCustomer.id,
        stripeSubscriptionId: stripeSubscription.id,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000)
      }
    });

    res.json({
      subscription,
      clientSecret: stripeSubscription.latest_invoice.payment_intent?.client_secret
    });

  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/cancel-subscription', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        subscription: true
      }
    });

    if (!user.subscription || user.subscription.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'No active subscription to cancel' });
    }

    // Cancel at Stripe
    if (user.subscription.stripeSubscriptionId) {
      await stripe.subscriptions.update(user.subscription.stripeSubscriptionId, {
        cancel_at_period_end: true
      });
    }

    // Update in database
    const updatedSubscription = await prisma.subscription.update({
      where: { id: user.subscription.id },
      data: {
        status: 'CANCELLED'
      }
    });

    res.json({ 
      message: 'Subscription cancelled successfully',
      subscription: updatedSubscription
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/my-subscription', async (req, res) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id }
    });

    res.json({ subscription });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: subscription.status.toUpperCase(),
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
          }
        });
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        await prisma.subscription.update({
          where: { stripeSubscriptionId: deletedSubscription.id },
          data: {
            status: 'CANCELLED'
          }
        });
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        await prisma.subscription.update({
          where: { stripeSubscriptionId: failedInvoice.subscription },
          data: {
            status: 'PAST_DUE'
          }
        });
        break;

      case 'customer.updated':
        const customer = event.data.object;
        await prisma.user.update({
          where: { email: customer.email },
          data: {
            subscription: {
              update: {
                stripeCustomerId: customer.id
              }
            }
          }
        });
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handling error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/create-setup-intent', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user.subscription?.stripeCustomerId) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: user.subscription.stripeCustomerId,
      payment_method_types: ['card']
    });

    res.json({
      clientSecret: setupIntent.client_secret
    });

  } catch (error) {
    console.error('Create setup intent error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/payment-methods', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user.subscription?.stripeCustomerId) {
      return res.json({ paymentMethods: [] });
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.subscription.stripeCustomerId,
      type: 'card'
    });

    res.json({
      paymentMethods: paymentMethods.data.map(pm => ({
        id: pm.id,
        brand: pm.card.brand,
        last4: pm.card.last4,
        exp_month: pm.card.exp_month,
        exp_year: pm.card.exp_year
      }))
    });

  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;