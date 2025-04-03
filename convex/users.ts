import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    username: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    image: v.optional(v.string()),
    followedGenres: v.array(v.id("genres")),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const username = args.email.split('@')[0];
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) return;

    await ctx.db.insert("users", {
      username,
      email: args.email,
      bio: args.bio,
      image: args.image,
      followers: 0,
      following: 0,
      posts: 0,
      followedGenres: [],
      clerkId: args.clerkId,
    });
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
      return user;
  },
});

export const updateProfile = mutation({
  args: {
    username: v.string(),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    await ctx.db.patch(currentUser._id, {
      username: args.username,
      bio: args.bio,
    });
  },
});

export async function getAuthenticatedUser(ctx:QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
      console.error("User is not authenticated");
      throw new Error("Unauthorized");
  }

  const currentUser = await ctx.db.query("users").withIndex(
      "by_clerk_id", (q) => q.eq("clerkId", identity.subject)
  ).first();

  if (!currentUser) {
      console.error("User not found:", identity.subject);
      throw new Error("User not found");
  }
  return currentUser;
}

