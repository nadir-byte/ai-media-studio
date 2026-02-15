import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Users table - synced from Clerk
export const users = defineTable({
  clerkId: v.string(),
  email: v.string(),
  name: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  plan: v.optional(v.union(
    v.literal("self_hosted"),
    v.literal("hosted")
  )),
  stripeCustomerId: v.optional(v.string()),
  stripeSubscriptionId: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_clerk_id", ["clerkId"])
  .index("by_email", ["email"])
  .index("by_stripe_customer", ["stripeCustomerId"]);

// Encrypted API keys - stored securely
export const apiKeys = defineTable({
  userId: v.id("users"),
  // Encrypted API keys (AES-256 encrypted)
  replicateKey: v.optional(v.string()), // encrypted
  falKey: v.optional(v.string()), // encrypted
  openaiKey: v.optional(v.string()), // encrypted
  anthropicKey: v.optional(v.string()), // encrypted
  stabilityKey: v.optional(v.string()), // encrypted
  // Metadata
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_user", ["userId"]);

// Generation history
export const generations = defineTable({
  userId: v.id("users"),
  type: v.union(
    v.literal("image"),
    v.literal("video"),
    v.literal("audio"),
    v.literal("text")
  ),
  provider: v.string(), // replicate, fal, openai, etc.
  model: v.string(),
  prompt: v.string(),
  // Results
  resultUrl: v.optional(v.string()),
  resultData: v.optional(v.any()),
  status: v.union(
    v.literal("pending"),
    v.literal("processing"),
    v.literal("completed"),
    v.literal("failed")
  ),
  error: v.optional(v.string()),
  // Metadata
  costCents: v.optional(v.number()),
  durationMs: v.optional(v.number()),
  createdAt: v.number(),
  completedAt: v.optional(v.number()),
})
  .index("by_user", ["userId"])
  .index("by_user_type", ["userId", "type"])
  .index("by_status", ["status"]);

// Subscriptions/Purchases - for tracking lifetime access
export const subscriptions = defineTable({
  userId: v.id("users"),
  plan: v.union(
    v.literal("self_hosted"),
    v.literal("hosted")
  ),
  // Payment info
  stripePaymentIntentId: v.optional(v.string()),
  stripeChargeId: v.optional(v.string()),
  amountCents: v.number(),
  currency: v.string(),
  status: v.union(
    v.literal("pending"),
    v.literal("completed"),
    v.literal("refunded"),
    v.literal("failed")
  ),
  // For Gumroad integration
  gumroadProductId: v.optional(v.string()),
  gumroadPurchaseId: v.optional(v.string()),
  // Metadata
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_status", ["status"]);

export default defineSchema({
  users,
  apiKeys,
  generations,
  subscriptions,
});
