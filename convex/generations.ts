import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { ConvexError } from "convex/values";

// ==================== QUERIES ====================

// Get all generations for current user
export const getUserGenerations = query({
  args: {
    limit: v.optional(v.number()),
    type: v.optional(v.union(
      v.literal("image"),
      v.literal("video"),
      v.literal("audio"),
      v.literal("text")
    )),
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

    let query = ctx.db
      .query("generations")
      .withIndex("by_user", (q) => q.eq("userId", user._id));

    if (args.type) {
      query = query.filter((q) => q.eq(q.field("type"), args.type));
    }

    const generations = await query
      .order("desc")
      .take(args.limit || 50);

    return generations;
  },
});

// Get a specific generation
export const getGeneration = query({
  args: { id: v.id("generations") },
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

    const generation = await ctx.db.get(args.id);

    if (!generation) {
      throw new ConvexError("Generation not found");
    }

    // Ensure user owns this generation
    if (generation.userId !== user._id) {
      throw new ConvexError("Unauthorized");
    }

    return generation;
  },
});

// Get generations by status
export const getGenerationsByStatus = query({
  args: {
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    ),
    limit: v.optional(v.number()),
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

    const generations = await ctx.db
      .query("generations")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), args.status))
      .order("desc")
      .take(args.limit || 50);

    return generations;
  },
});

// Get usage stats for user
export const getUserStats = query({
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

    // Get all completed generations
    const allGenerations = await ctx.db
      .query("generations")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .collect();

    const totalCost = allGenerations.reduce(
      (sum, gen) => sum + (gen.costCents || 0),
      0
    );

    const totalDuration = allGenerations.reduce(
      (sum, gen) => sum + (gen.durationMs || 0),
      0
    );

    const byType = {
      image: 0,
      video: 0,
      audio: 0,
      text: 0,
    };

    for (const gen of allGenerations) {
      byType[gen.type]++;
    }

    return {
      totalGenerations: allGenerations.length,
      totalCostCents: totalCost,
      totalDurationMs: totalDuration,
      byType,
    };
  },
});

// ==================== MUTATIONS ====================

// Create a new generation
export const createGeneration = mutation({
  args: {
    type: v.union(
      v.literal("image"),
      v.literal("video"),
      v.literal("audio"),
      v.literal("text")
    ),
    provider: v.string(),
    model: v.string(),
    prompt: v.string(),
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

    // Check subscription
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .first();

    if (!subscription) {
      throw new ConvexError("Active subscription required");
    }

    const generationId = await ctx.db.insert("generations", {
      userId: user._id,
      type: args.type,
      provider: args.provider,
      model: args.model,
      prompt: args.prompt,
      resultUrl: undefined,
      resultData: undefined,
      status: "pending",
      error: undefined,
      costCents: undefined,
      durationMs: undefined,
      createdAt: Date.now(),
      completedAt: undefined,
    });

    return generationId;
  },
});

// Update generation status and results
// Can be called both from client (for manual updates) and from internal actions
export const updateGeneration = mutation({
  args: {
    id: v.id("generations"),
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    )),
    resultUrl: v.optional(v.string()),
    resultData: v.optional(v.any()),
    error: v.optional(v.string()),
    costCents: v.optional(v.number()),
    durationMs: v.optional(v.number()),
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

    const generation = await ctx.db.get(args.id);

    if (!generation) {
      throw new ConvexError("Generation not found");
    }

    // Ensure user owns this generation
    if (generation.userId !== user._id) {
      throw new ConvexError("Unauthorized");
    }

    const update: Record<string, string | number | any | undefined> = {
      updatedAt: Date.now(),
    };

    if (args.status) update.status = args.status;
    if (args.resultUrl !== undefined) update.resultUrl = args.resultUrl;
    if (args.resultData !== undefined) update.resultData = args.resultData;
    if (args.error !== undefined) update.error = args.error;
    if (args.costCents !== undefined) update.costCents = args.costCents;
    if (args.durationMs !== undefined) update.durationMs = args.durationMs;

    // If completing, set completedAt
    if (args.status === "completed" || args.status === "failed") {
      update.completedAt = Date.now();
    }

    await ctx.db.patch(args.id, update);
    return args.id;
  },
});

// Delete a generation
export const deleteGeneration = mutation({
  args: { id: v.id("generations") },
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

    const generation = await ctx.db.get(args.id);

    if (!generation) {
      throw new ConvexError("Generation not found");
    }

    // Ensure user owns this generation
    if (generation.userId !== user._id) {
      throw new ConvexError("Unauthorized");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// ==================== INTERNAL MUTATIONS ====================

// Update generation from internal context (called from actions/workers)
export const updateGenerationInternal = internalMutation({
  args: {
    id: v.id("generations"),
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("completed"),
      v.literal("failed")
    )),
    resultUrl: v.optional(v.string()),
    resultData: v.optional(v.any()),
    error: v.optional(v.string()),
    costCents: v.optional(v.number()),
    durationMs: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const generation = await ctx.db.get(args.id);

    if (!generation) {
      throw new ConvexError("Generation not found");
    }

    const update: Record<string, string | number | any | undefined> = {
      updatedAt: Date.now(),
    };

    if (args.status) update.status = args.status;
    if (args.resultUrl !== undefined) update.resultUrl = args.resultUrl;
    if (args.resultData !== undefined) update.resultData = args.resultData;
    if (args.error !== undefined) update.error = args.error;
    if (args.costCents !== undefined) update.costCents = args.costCents;
    if (args.durationMs !== undefined) update.durationMs = args.durationMs;

    if (args.status === "completed" || args.status === "failed") {
      update.completedAt = Date.now();
    }

    await ctx.db.patch(args.id, update);
    return args.id;
  },
});

// Delete all generations for a user (used when deleting account)
export const deleteUserGenerations = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const generations = await ctx.db
      .query("generations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const gen of generations) {
      await ctx.db.delete(gen._id);
    }

    return generations.length;
  },
});
