import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    username: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    image: v.optional(v.string()),
    followers: v.number(),
    following: v.number(),
    posts: v.number(),
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