import Stripe from "stripe";

// Lazy initialization of Stripe to avoid build-time errors
let stripeInstance: Stripe | null = null;

export const getStripe = (): Stripe => {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
    }

    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-05-28.basil",
      typescript: true,
    });
  }

  return stripeInstance;
};

// For backward compatibility, export the getter function as default
export const stripe = getStripe;

// Product configuration
export const STRIPE_PRODUCTS = {
  monthly: {
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID || "price_monthly_placeholder",
    amount: 1499, // $14.99 in cents
  },
  annual: {
    priceId: process.env.STRIPE_ANNUAL_PRICE_ID || "price_annual_placeholder",
    amount: 14999, // $149.99 in cents
  },
};
