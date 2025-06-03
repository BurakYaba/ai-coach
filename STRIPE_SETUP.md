# Stripe Integration Setup

This document explains how to set up Stripe for individual user payments in the Fluenta app.

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_MONTHLY_PRICE_ID=price_your_monthly_price_id
STRIPE_ANNUAL_PRICE_ID=price_your_annual_price_id
```

## Setup Steps

### 1. Create Stripe Account

- Go to [Stripe Dashboard](https://dashboard.stripe.com)
- Create an account or log in
- Switch to Test mode for development

### 2. Get API Keys

- In Stripe Dashboard, go to Developers > API keys
- Copy the **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Copy the **Secret key** → `STRIPE_SECRET_KEY`

### 3. Create Products and Prices

- Go to Products in Stripe Dashboard
- Create a product called "Fluenta Subscription"
- Add two prices:
  - Monthly: $14.99/month (recurring)
  - Annual: $149.99/year (recurring)
- Copy the price IDs → `STRIPE_MONTHLY_PRICE_ID` and `STRIPE_ANNUAL_PRICE_ID`

### 4. Set Up Webhook

- Go to Developers > Webhooks
- Add endpoint: `https://yourdomain.com/api/payments/webhook`
- Select these events:
  - `checkout.session.completed`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- Copy the webhook signing secret → `STRIPE_WEBHOOK_SECRET`

## How It Works

### Registration Flow

1. **Individual Registration**: Users can register without a school code
2. **Free Trial**: All users get 7 days free access
3. **Payment Required**: After trial expires, individual users must pay

### School vs Individual Users

- **School Users**: Associated with a school/branch, managed by school admins
- **Individual Users**: Not associated with any school, manage their own subscriptions

### Payment Flow

1. User clicks "Choose Plan" on pricing page
2. Stripe Checkout session created via `/api/payments/create-checkout`
3. User completes payment on Stripe
4. Webhook updates user subscription in database
5. User gains access to platform

## Testing

Use Stripe test cards:

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## Production Deployment

1. Switch to Live mode in Stripe Dashboard
2. Update environment variables with live keys
3. Update webhook endpoint to production URL
4. Test with real payment methods

## Security Notes

- Never expose secret keys in client-side code
- Webhook endpoint validates signatures
- All payments processed securely by Stripe
- User data encrypted in database
