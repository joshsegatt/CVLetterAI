import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { platformEnv } from '../platform/env';
import { getStripeClient } from './stripe';
import { userPlanManager } from '../auth/userPlans';

export async function handleStripeWebhook(request: Request) {
  const signature = request.headers.get('stripe-signature') ?? '';
  if (!platformEnv.stripeWebhookSecret) {
    return NextResponse.json({ received: false }, { status: 500 });
  }
  const payload = await request.text();
  const stripe = getStripeClient();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      platformEnv.stripeWebhookSecret
    );
  } catch (error) {
    console.error('Stripe webhook signature verification failed', error);
    return NextResponse.json({ received: false }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      console.info('Checkout completed', event.data.object.id);
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
      
    case 'customer.subscription.updated':
      console.info('Subscription updated', event.data.object.id);
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;
      
    case 'invoice.payment_succeeded':
      console.info('Payment succeeded', event.data.object.id);
      await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
      break;
      
    case 'customer.subscription.deleted':
      console.info('Subscription canceled', event.data.object.id);
      await handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
      break;
      
    default:
      console.debug(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    // Get customer email as user identifier
    const userEmail = session.customer_email || session.customer_details?.email;
    const planId = session.metadata?.product;
    
    if (!userEmail) {
      console.error('No customer email found in checkout session');
      return;
    }
    
    console.log(`Processing checkout for user: ${userEmail}, plan: ${planId}`);
    
    if (planId === 'price_one_time') {
      // Activate Pro plan
      userPlanManager.upgradeToPro(userEmail, session.customer as string);
      console.log(`✅ Pro plan activated for user: ${userEmail}`);
    } else if (planId === 'price_subscription') {
      // Activate Enterprise plan
      userPlanManager.upgradeToEnterprise(
        userEmail, 
        session.customer as string, 
        session.subscription as string
      );
      console.log(`✅ Enterprise plan activated for user: ${userEmail}`);
    }
  } catch (error) {
    console.error('Error processing checkout:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const stripe = getStripeClient();
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    
    if ('email' in customer && customer.email) {
      // Refresh enterprise plan expiry
      const plan = userPlanManager.getUserPlan(customer.email);
      if (plan.planType === 'enterprise') {
        const expiryDate = new Date(subscription.current_period_end * 1000);
        plan.expiryDate = expiryDate;
        plan.status = 'active';
        console.log(`✅ Enterprise plan renewed for user: ${customer.email}`);
      }
    }
  } catch (error) {
    console.error('Error processing subscription update:', error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    if (invoice.subscription) {
      const stripe = getStripeClient();
      const customer = await stripe.customers.retrieve(invoice.customer as string);
      
      if ('email' in customer && customer.email) {
        // Extend enterprise plan
        const plan = userPlanManager.getUserPlan(customer.email);
        if (plan.planType === 'enterprise') {
          const expiryDate = new Date();
          expiryDate.setMonth(expiryDate.getMonth() + 1);
          plan.expiryDate = expiryDate;
          plan.status = 'active';
          console.log(`✅ Enterprise plan payment processed for user: ${customer.email}`);
        }
      }
    }
  } catch (error) {
    console.error('Error processing payment:', error);
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  try {
    const stripe = getStripeClient();
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    
    if ('email' in customer && customer.email) {
      const plan = userPlanManager.getUserPlan(customer.email);
      if (plan.planType === 'enterprise') {
        plan.status = 'canceled';
        console.log(`❌ Enterprise plan canceled for user: ${customer.email}`);
      }
    }
  } catch (error) {
    console.error('Error processing subscription cancellation:', error);
  }
}
