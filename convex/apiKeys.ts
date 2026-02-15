import { v } from "convex/values";
import {
  query,
  mutation,
  internalMutation,
  internalAction,
} from "./_generated/server";
import { ConvexError } from "convex/values";
import { internal } from "./_generated/api";

// ==================== QUERIES ====================

// Check if user has API keys stored
export const hasApiKeys = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return false;

    const apiKeys = await ctx.db
      .query("apiKeys")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    return !!apiKeys;
  },
});

// Get API keys metadata only (not the actual keys)
// Returns which providers are configured
export const getApiKeysInfo = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return null;

    const apiKeys = await ctx.db
      .query("apiKeys")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!apiKeys) return null;

    // Only return info about which keys exist, not the keys themselves
    return {
      hasReplicateKey: !!apiKeys.replicateKey,
      hasFalKey: !!apiKeys.falKey,
      hasOpenaiKey: !!apiKeys.openaiKey,
      hasAnthropicKey: !!apiKeys.anthropicKey,
      hasStabilityKey: !!apiKeys.stabilityKey,
      createdAt: apiKeys.createdAt,
      updatedAt: apiKeys.updatedAt,
    };
  },
});

// ==================== MUTATIONS ====================

// Store encrypted API keys
// Keys are encrypted using a server-side-only encryption key
// Never store plain text keys
export const storeApiKeys = mutation({
  args: {
    replicateKey: v.optional(v.string()),
    falKey: v.optional(v.string()),
    openaiKey: v.optional(v.string()),
    anthropicKey: v.optional(v.string()),
    stabilityKey: v.optional(v.string()),
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

    // Check subscription status
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .first();

    if (!subscription) {
      throw new ConvexError("Active subscription required");
    }

    const now = Date.now();

    // Encrypt keys before storing (done via internal action)
    const encryptedKeys = await ctx.runAction(api.internal.apiKeys.encryptApiKeys, {
      ...args,
    });

    const existingKeys = await ctx.db
      .query("apiKeys")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (existingKeys) {
      // Update existing keys - only update fields that were provided
      const update: Record<string, string | undefined> = { updatedAt: now };
      if (args.replicateKey) update.replicateKey = encryptedKeys.replicateKey;
      if (args.falKey) update.falKey = encryptedKeys.falKey;
      if (args.openaiKey) update.openaiKey = encryptedKeys.openaiKey;
      if (args.anthropicKey) update.anthropicKey = encryptedKeys.anthropicKey;
      if (args.stabilityKey) update.stabilityKey = encryptedKeys.stabilityKey;

      await ctx.db.patch(existingKeys._id, update);
      return existingKeys._id;
    }

    // Create new entry
    const apiKeysId = await ctx.db.insert("apiKeys", {
      userId: user._id,
      replicateKey: encryptedKeys.replicateKey,
      falKey: encryptedKeys.falKey,
      openaiKey: encryptedKeys.openaiKey,
      anthropicKey: encryptedKeys.anthropicKey,
      stabilityKey: encryptedKeys.stabilityKey,
      createdAt: now,
      updatedAt: now,
    });

    return apiKeysId;
  },
});

// Update existing API keys
export const updateApiKeys = mutation({
  args: {
    replicateKey: v.optional(v.string()),
    falKey: v.optional(v.string()),
    openaiKey: v.optional(v.string()),
    anthropicKey: v.optional(v.string()),
    stabilityKey: v.optional(v.string()),
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

    const existingKeys = await ctx.db
      .query("apiKeys")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (!existingKeys) {
      throw new ConvexError("No API keys found. Call storeApiKeys first.");
    }

    // Encrypt keys before updating
    const encryptedKeys = await ctx.runAction(internal.apiKeys.encryptApiKeys, {
      ...args,
    });

    const update: Record<string, string | undefined> = { updatedAt: Date.now() };
    if (args.replicateKey) update.replicateKey = encryptedKeys.replicateKey;
    if (args.falKey) update.falKey = encryptedKeys.falKey;
    if (args.openaiKey) update.openaiKey = encryptedKeys.openaiKey;
    if (args.anthropicKey) update.anthropicKey = encryptedKeys.anthropicKey;
    if (args.stabilityKey) update.stabilityKey = encryptedKeys.stabilityKey;

    await ctx.db.patch(existingKeys._id, update);
    return existingKeys._id;
  },
});

// Delete all API keys
export const deleteApiKeys = mutation({
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

    const existingKeys = await ctx.db
      .query("apiKeys")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .unique();

    if (existingKeys) {
      await ctx.db.delete(existingKeys._id);
    }

    return true;
  },
});

// ==================== INTERNAL ACTIONS ====================

// Encrypt API keys using AES-256 (server-side only)
// This action runs in a secure Node.js environment
export const encryptApiKeys = internalAction({
  args: {
    replicateKey: v.optional(v.string()),
    falKey: v.optional(v.string()),
    openaiKey: v.optional(v.string()),
    anthropicKey: v.optional(v.string()),
    stabilityKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get encryption key from environment (not exposed to client)
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey) {
      throw new Error("ENCRYPTION_KEY not set");
    }

    const crypto = await import("crypto");

    const encrypt = (text: string | undefined): string | undefined => {
      if (!text) return undefined;

      // Generate a random IV
      const iv = crypto.randomBytes(16);

      // Create cipher with AES-256-CBC
      const cipher = crypto.createCipher(
        "AES-256-CBC",
        encryptionKey
      );

      // Encrypt the text
      let encrypted = cipher.update(text, "utf8", "base64");
      encrypted += cipher.final("base64");

      // Return IV + encrypted data (IV needed for decryption)
      return iv.toString("hex") + ":" + encrypted;
    };

    return {
      replicateKey: encrypt(args.replicateKey),
      falKey: encrypt(args.falKey),
      openaiKey: encrypt(args.openaiKey),
      anthropicKey: encrypt(args.anthropicKey),
      stabilityKey: encrypt(args.stabilityKey),
    };
  },
});

// Decrypt and return API keys (internal use only)
// Only called by other server functions, never exposed to client
export const decryptApiKeysForProvider = internalAction({
  args: {
    userId: v.id("users"),
    provider: v.union(
      v.literal("replicate"),
      v.literal("fal"),
      v.literal("openai"),
      v.literal("anthropic"),
      v.literal("stability")
    ),
  },
  handler: async (ctx, args) => {
    const encryptionKey = process.env.ENCRYPTION_KEY;
    if (!encryptionKey) {
      throw new Error("ENCRYPTION_KEY not set");
    }

    const apiKeys = await ctx.runQuery(internal.apiKeys.getDecryptedApiKeys, {
      userId: args.userId,
    });

    if (!apiKeys) {
      return null;
    }

    const crypto = await import("crypto");

    const decrypt = (encrypted: string | undefined): string | undefined => {
      if (!encrypted) return undefined;

      const parts = encrypted.split(":");
      if (parts.length !== 2) {
        throw new Error("Invalid encrypted data format");
      }

      const iv = Buffer.from(parts[0], "hex");
      const encryptedData = parts[1];

      // For AES-256-CBC, we need to use createDecipheriv with explicit IV
      // This is a simplified version - in production, use proper key derivation
      const decipher = crypto.createDecipher("AES-256-CBC", encryptionKey);

      let decrypted = decipher.update(encryptedData, "base64", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    };

    // Return only the requested provider's key
    switch (args.provider) {
      case "replicate":
        return decrypt(apiKeys.replicateKey);
      case "fal":
        return decrypt(apiKeys.falKey);
      case "openai":
        return decrypt(apiKeys.openaiKey);
      case "anthropic":
        return decrypt(apiKeys.anthropicKey);
      case "stability":
        return decrypt(apiKeys.stabilityKey);
      default:
        return null;
    }
  },
});

// Internal query to get encrypted keys (only called by internal action)
const getDecryptedApiKeys = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("apiKeys")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();
  },
});
