import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripePaymentIntent = async (amount, currency = 'usd') => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        platform: 'staysitgo'
      }
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    console.error('Stripe payment intent creation error:', error);
    throw new Error('Failed to create payment intent');
  }
};

export const updateStripeCustomer = async (customerId, data) => {
  try {
    const customer = await stripe.customers.update(customerId, data);
    return customer;
  } catch (error) {
    console.error('Stripe customer update error:', error);
    throw new Error('Failed to update customer');
  }
};

export const retrieveStripeSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Stripe subscription retrieval error:', error);
    throw new Error('Failed to retrieve subscription');
  }
};

export const createStripeRefund = async (paymentIntentId, amount) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: Math.round(amount * 100)
    });
    return refund;
  } catch (error) {
    console.error('Stripe refund creation error:', error);
    throw new Error('Failed to create refund');
  }
};

export const getStripeBalance = async () => {
  try {
    const balance = await stripe.balance.retrieve();
    return balance;
  } catch (error) {
    console.error('Stripe balance retrieval error:', error);
    throw new Error('Failed to retrieve balance');
  }
};