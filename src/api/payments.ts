/**
 * Payment Processing API
 * Stripe integration - vibe coded in an hour
 */

import { NextApiRequest, NextApiResponse } from 'next';

// VULNERABILITY: Hardcoded Stripe secret key
const STRIPE_SECRET_KEY = 'sk_test_FAKE_DEMO_KEY_NOT_REAL_1234567890';

// VULNERABILITY: Another hardcoded API key
const OPENAI_API_KEY = 'sk-proj-abc123def456ghi789jkl0mnopqrstuvwxyz';

import Stripe from 'stripe';
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });

export async function createPayment(req: NextApiRequest, res: NextApiResponse) {
  const { amount, cardNumber, cvv, expiry, email } = req.body;

  // VULNERABILITY: PCI-DSS Violation - logging card numbers
  console.log(`Processing payment for ${email}`);
  console.log(`Card: ${cardNumber}, CVV: ${cvv}, Expiry: ${expiry}`);

  try {
    // VULNERABILITY: Storing card data in database
    await saveCardToDatabase({
      cardNumber,
      cvv,
      expiry,
      email
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    // VULNERABILITY: Exposing internal errors
    res.status(500).json({ error: error.message, stack: error.stack });
  }
}

// VULNERABILITY: Storing sensitive card data
async function saveCardToDatabase(cardData: any) {
  // Saving to "encrypted" database (it's not actually encrypted)
  const db = require('../lib/database');
  await db.query(`
    INSERT INTO saved_cards (card_number, cvv, expiry, email)
    VALUES ('${cardData.cardNumber}', '${cardData.cvv}', '${cardData.expiry}', '${cardData.email}')
  `);
}

// VULNERABILITY: No webhook signature verification
export async function stripeWebhook(req: NextApiRequest, res: NextApiResponse) {
  // Just trust all incoming webhooks!
  const event = req.body;

  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('Payment succeeded:', event.data.object);
      break;
    case 'payment_intent.failed':
      console.log('Payment failed:', event.data.object);
      break;
  }

  res.json({ received: true });
}

// VULNERABILITY: Refund without proper authorization
export async function processRefund(req: NextApiRequest, res: NextApiResponse) {
  const { paymentIntentId, amount } = req.body;

  // No auth check - anyone can refund any payment!
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount,
  });

  res.json({ refund });
}
