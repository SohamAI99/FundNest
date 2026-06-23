const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

const prisma = new PrismaClient();

// Initialize Razorpay conditionally
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log('✅ Razorpay initialized successfully.');
  } catch (err) {
    console.error('❌ Failed to initialize Razorpay:', err);
  }
} else {
  console.warn('⚠️ WARNING: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are not defined. Subscriptions route will run in simulation mode.');
}

// Subscription plan configurations
const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: {
      messages_per_month: 10,
      connections_per_month: 15,
      profile_views_per_month: 50,
      pitch_views_per_month: 5,
      ai_matching: false,
      analytics_dashboard: false,
      priority_support: false,
      verified_badge: false,
      video_calls: false,
      document_sharing: false
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 99900, // ₹999 in paisa
    yearlyPrice: 999900, // ₹9,999 in paisa (save ₹1,989)
    features: {
      messages_per_month: -1, // unlimited
      connections_per_month: -1,
      profile_views_per_month: -1,
      pitch_views_per_month: -1,
      ai_matching: true,
      analytics_dashboard: true,
      priority_support: true,
      verified_badge: true,
      video_calls: false,
      document_sharing: true
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 299900, // ₹2,999 in paisa
    yearlyPrice: 2999900, // ₹29,999 in paisa (save ₹5,989)
    features: {
      messages_per_month: -1,
      connections_per_month: -1,
      profile_views_per_month: -1,
      pitch_views_per_month: -1,
      ai_matching: true,
      analytics_dashboard: true,
      priority_support: true,
      verified_badge: true,
      video_calls: true,
      document_sharing: true
    }
  }
};

// Get all subscription plans
router.get('/plans', (req, res) => {
  const plans = Object.values(PLANS).map(plan => ({
    id: plan.id,
    name: plan.name,
    monthlyPrice: plan.monthlyPrice,
    yearlyPrice: plan.yearlyPrice,
    features: plan.features
  }));

  res.json({
    success: true,
    plans
  });
});

// Get current user's subscription status
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        subscription_plan: true,
        subscription_status: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get active subscription details
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        user_id: req.user.id,
        status: 'active'
      },
      orderBy: { created_at: 'desc' }
    });

    // Get recent payments
    const recentPayments = await prisma.payment.findMany({
      where: { user_id: req.user.id },
      orderBy: { created_at: 'desc' },
      take: 10
    });

    const planConfig = PLANS[user.subscription_plan] || PLANS.free;

    res.json({
      success: true,
      subscription: {
        plan: user.subscription_plan,
        planDetails: planConfig,
        status: user.subscription_status,
        activeSubscription: activeSubscription ? {
          id: activeSubscription.id,
          billingCycle: activeSubscription.billing_cycle,
          amount: activeSubscription.amount,
          startsAt: activeSubscription.starts_at,
          expiresAt: activeSubscription.expires_at
        } : null
      },
      billingHistory: recentPayments.map(p => ({
        id: p.id,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        description: p.description,
        paymentMethod: p.payment_method,
        createdAt: p.created_at
      }))
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ success: false, message: 'Server error getting subscription status' });
  }
});

// Create a subscription order (Real Razorpay / Simulation Fallback)
router.post('/create-order', authenticateToken, async (req, res) => {
  try {
    const { plan, billingCycle } = req.body;

    if (!plan || !['pro', 'enterprise'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan selected' });
    }

    if (!billingCycle || !['monthly', 'yearly'].includes(billingCycle)) {
      return res.status(400).json({ success: false, message: 'Invalid billing cycle' });
    }

    const planConfig = PLANS[plan];
    const amount = billingCycle === 'yearly' ? planConfig.yearlyPrice : planConfig.monthlyPrice;

    if (razorpay) {
      // Create real Razorpay order
      const options = {
        amount: amount, // amount in paisa (INR)
        currency: 'INR',
        receipt: `receipt_sub_${req.user.id}_${Date.now()}`,
        notes: {
          userId: req.user.id,
          plan: plan,
          billingCycle: billingCycle
        }
      };

      const order = await razorpay.orders.create(options);
      res.json({
        success: true,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          plan: plan,
          billingCycle: billingCycle,
          planName: planConfig.name
        },
        keyId: process.env.RAZORPAY_KEY_ID,
        isSimulation: false
      });
    } else {
      // Simulation mode
      const orderId = `order_sim_${crypto.randomBytes(12).toString('hex')}`;
      res.json({
        success: true,
        order: {
          id: orderId,
          amount: amount,
          currency: 'INR',
          plan: plan,
          billingCycle: billingCycle,
          planName: planConfig.name
        },
        keyId: 'rzp_test_simulationkey123',
        isSimulation: true
      });
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Server error creating order' });
  }
});

// Verify payment and activate subscription
router.post('/verify-payment', authenticateToken, async (req, res) => {
  try {
    const { orderId, paymentId, signature, plan, billingCycle, isSimulation } = req.body;

    if (!orderId || !paymentId || !plan) {
      return res.status(400).json({ success: false, message: 'Missing required payment details' });
    }

    const planConfig = PLANS[plan];
    if (!planConfig) {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    const amount = billingCycle === 'yearly' ? planConfig.yearlyPrice : planConfig.monthlyPrice;

    // Verify signature if not simulated and Razorpay is active
    if (razorpay && !isSimulation) {
      if (!signature) {
        return res.status(400).json({ success: false, message: 'Missing payment signature for verification' });
      }
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(orderId + "|" + paymentId)
        .digest('hex');

      if (generated_signature !== signature) {
        return res.status(400).json({ success: false, message: 'Payment verification failed: invalid signature' });
      }
    }

    // Calculate expiry date
    const expiresAt = new Date();
    if (billingCycle === 'yearly') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    // Use transaction to ensure atomic updates
    const result = await prisma.$transaction(async (tx) => {
      // Deactivate any existing active subscriptions for this user
      await tx.subscription.updateMany({
        where: {
          user_id: req.user.id,
          status: 'active'
        },
        data: {
          status: 'expired',
          expires_at: new Date()
        }
      });

      // Create new subscription record
      const subscription = await tx.subscription.create({
        data: {
          user_id: req.user.id,
          plan: plan,
          status: 'active',
          billing_cycle: billingCycle,
          amount: amount,
          currency: 'INR',
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature || 'simulated_sig',
          starts_at: new Date(),
          expires_at: expiresAt
        }
      });

      // Create payment record
      await tx.payment.create({
        data: {
          user_id: req.user.id,
          amount: amount,
          currency: 'INR',
          status: 'captured',
          description: `${planConfig.name} Plan - ${billingCycle === 'yearly' ? 'Annual' : 'Monthly'} Subscription`,
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature || 'simulated_sig',
          payment_method: isSimulation ? 'simulated' : 'card',
          receipt: `receipt_${Date.now()}`
        }
      });

      // Update user's subscription status
      const updatedUser = await tx.user.update({
        where: { id: req.user.id },
        data: {
          subscription_plan: plan,
          subscription_status: 'active'
        }
      });

      return { subscription, updatedUser };
    });

    res.json({
      success: true,
      message: `Successfully subscribed to ${planConfig.name} plan`,
      subscription: {
        id: result.subscription.id,
        plan: plan,
        status: 'active',
        expiresAt: expiresAt
      },
      user: {
        subscriptionPlan: plan,
        subscriptionStatus: 'active'
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: 'Server error verifying payment' });
  }
});

// Cancel subscription
router.post('/cancel', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user || user.subscription_plan === 'free') {
      return res.status(400).json({ success: false, message: 'No active subscription to cancel' });
    }

    // Cancel active subscription
    await prisma.subscription.updateMany({
      where: {
        user_id: req.user.id,
        status: 'active'
      },
      data: {
        status: 'cancelled',
        cancelled_at: new Date()
      }
    });

    // Update user plan to free
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        subscription_plan: 'free',
        subscription_status: 'cancelled'
      }
    });

    res.json({
      success: true,
      message: 'Subscription cancelled successfully. You will retain access until the end of your billing period.'
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ success: false, message: 'Server error cancelling subscription' });
  }
});

module.exports = router;
