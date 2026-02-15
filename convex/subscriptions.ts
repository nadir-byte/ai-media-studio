import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { ConvexError } from "convex/values";

// ==================== QUERIES ====================

// Get current user's subscriptions
export const getMySubscriptions = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const subscriptions = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return subscriptions;
  },
});

// Check if user has active subscription
export const hasActiveSubscription = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return false;

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .first();

    return !!subscription;
  },
});

// ==================== MUTATIONS ====================

// Create a subscription (called from Stripe webhook)
export const createSubscription = mutation({
  args: {
    plan: v.union(v.literal("self_hosted"), v.literal("hosted")),
    amountCents: v.number(),
    currency: v.string(),
    stripePaymentIntentId: v.optional(v.string()),
    stripeChargeId: v.optional(v.string()),
    gumroadProductId: v.optional(v.string()),
    gumroadPurchaseId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    // Check if already has a subscription
    const existingSub = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .first();

    if (existingSub) {
      throw new ConvexError("User already has an active subscription");
    }

    const now = Date.now();

    const subscriptionId = await ctx.db.insert("subscriptions", {
      userId: user._id,
      plan: args.plan,
      amountCents: args.amountCents,
      currency: args.currency,
      stripePaymentIntentId: args.stripePaymentIntentId,
      stripeChargeId: args.stripeChargeId,
      gumroadProductId: args.gumroadProductId,
      gumroadPurchaseId: args.gumroadPurchaseId,
      status: "completed", // Mark as completed immediately for lifetime access
      createdAt: now,
      updatedAt: now,
    });

    // Update user's plan
    await ctx.db.patch(user._id, {
      plan: args.plan,
      updatedAt: now,
    });

    return subscriptionId;
  },
});

// Mark subscription as refunded (called from webhook)
export const refundSubscription = mutation({
  args: { subscriptionId: v.id("subscriptions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const subscription = await ctx.db.get(args.subscriptionId);

    if (!subscription) {
      throw new ConvexError("Subscription not found");
    }

    if (subscription.userId !== user._id) {
      throw new ConvexError("Unauthorized");
    }

    await ctx.db.patch(args.subscriptionId, {
      status: "refunded",
      updatedAt: Date.now(),
    });

    // Update user's plan to null (no active subscription)
    await ctx.db.patch(user._id, {
      plan: undefined,
      updatedAt: Date.now(),
    });

    return args.subscriptionId;
  },
});

// ==================== INTERNAL MUTATIONS ====================

// Create subscription from webhook (no auth required)
export const createSubscriptionFromWebhook = internalMutation({
  args: {
    clerkId: v.string(),
    plan: v.union(v.literal("self_hosted"), v.literal("hosted")),
    amountCents: v.number(),
    currency: v.string(),
    stripePaymentIntentId: v.optional(v.string()),
    stripeChargeId: v.optional(v.string()),
    gumroadProductId: v.optional(v.string()),
    gumroadPurchaseId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const now = Date.now();

    const subscriptionId = await ctx.db.insert("subscriptions", {
      userId: user._id,
      plan: args.plan,
      amountCents: args.amountCents,
      currency: args.currency,
      stripePaymentIntentId: args.stripePaymentIntentId,
      stripeChargeId: args.stripeChargeId,
      gumroadProductId: args.gumroadProductId,
      gumroadPurchaseId: args.gumroadPurchaseId,
      status: "completed",
      createdAt: now,
      updatedAt: now,
    });

    // Update user's plan
    await ctx.db.patch(user._id, {
      plan: args.plan,
      updatedAt: now,
    });

    return subscriptionId;
  },
});

// Refund subscription from webhook
export const refundSubscriptionFromWebhook = internalMutation({
  args: {
    stripePaymentIntentId: v.optional(v.string()),
    stripeChargeId: v.optional(v.string()),
    gumroadPurchaseId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let subscription;

    if (args.stripePaymentIntentId) {
      subscription = await ctx.db
        .query("subscriptions")
        .filter((q) => q.eq(q.field("stripePaymentIntentId"), args.stripePaymentIntentId))
        .first();
    } else if (args.stripeChargeId) {
      subscription = await ctx.db
        .query("subscriptions")
        .filter((q) => q.eq(q.field("stripeChargeId"), args.stripeChargeId))
        .first();
    } else if (args.gumroadPurchaseId) {
      subscription = await ctx.db
        .query("subscriptions")
        .filter((q) => q.eq(q.field("gumroadPurchaseId"), args.gumroadPurchaseId))
        .first();
    }

    if (!subscription) {
      throw new ConvexError("Subscription not found");
    }

    await ctx.db.patch(subscription._id, {
      status: "refunded",
      updatedAt: Date.now(),
    });

    // Update user's plan
    await ctx.db.patch(subscription.userId, {
      plan: undefined,
      updatedAt: Date.now(),
    });

    return subscription._id;
  },
});

// Delete all subscriptions for a user
export const deleteUserSubscriptions = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const subscriptions = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const sub of subscriptions) {
      await ctx.db.delete(sub._id);
    }

    return subscriptions.length;
  },
});
