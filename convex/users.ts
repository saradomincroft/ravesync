import { mutation, MutationCtx, QueryCtx } from "./_generated/server";
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
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) return;

    await ctx.db.insert("users", {
      username: args.username,
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