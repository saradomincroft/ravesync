import { Id } from "./_generated/dataModel";
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
    const userImage = args.image || "../assets/images/default-user.svg";
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) return;

    await ctx.db.insert("users", {
      username,
      email: args.email,
      bio: args.bio,
      image: userImage,
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
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    const normalizedUsername = args.username.toLowerCase();

    if (normalizedUsername !== currentUser.username) {

      if (normalizedUsername.length > 16) {
        throw new Error("Username must be 16 characters or less.");
      }
      
      if (/\s/.test(normalizedUsername)) {
        throw new Error("Username cannot contain spaces.");
      }

      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", normalizedUsername))
        .first();

      if (existingUser) {
        throw new Error("Username already taken");
      }
    }

    const updateFields: any = {
      username: args.username,
      bio: args.bio,
    };

    if (args.image) {
      updateFields.image = args.image;
    }

    await ctx.db.patch(currentUser._id, updateFields);
    const updatedUser = await ctx.db.get(currentUser._id);
    return updatedUser;
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
};

export const getUserProfile = query({
  args: {id: v.id("users")},
  handler: async (ctx, args) => {
      const user = await ctx.db.get(args.id);
      if(!user) throw new Error("User not found")

      return user
  }
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

export const isFollowing = query({
  args: { followingId: v.id("users") },
  handler: async (ctx, args) => {
      const currentUser = await getAuthenticatedUser(ctx);

      const follow = await ctx.db
          .query("follows")
          .withIndex("by_both", (q) =>
              q.eq("followerId", currentUser._id).eq("followingId", args.followingId)
          )
          .first();

      return !!follow;
  },
});

export const toggleFollow = mutation({
  args: {followingId: v.id("users") },
  handler: async (ctx, args) => {
      const currentUser = await getAuthenticatedUser(ctx);

      // todo: make reusable
      const existing = await ctx.db
          .query("follows")
          .withIndex("by_both", (q) =>
              q.eq("followerId", currentUser._id).eq("followingId", args.followingId)
      )
      .first();
      if(existing) {
          // unfollow
          await ctx.db.delete(existing._id);
          await updateFollowCounts(ctx,currentUser._id, args.followingId, false);
      } else {
          // follow
          await ctx.db.insert("follows", {
              followerId: currentUser._id,
              followingId: args.followingId,
          })
          await updateFollowCounts(ctx,currentUser._id, args.followingId, true);

          // create notification
          await ctx.db.insert("notifications", {
              receiverId: args.followingId,
              senderId: currentUser._id,
              type: "follow",
          });
      }
  }
});

async function updateFollowCounts(
  ctx: MutationCtx,
  followerId: Id<"users">,
  followingId: Id<"users">,
  isFollow: boolean
) {
  const follower = await ctx.db.get(followerId);
  const following = await ctx.db.get(followingId);

  if (follower && following) {
      await ctx.db.patch(followerId, {
          following: follower.following + (isFollow ? 1 : -1),
      });
      await ctx.db.patch(followingId, {
          followers: following.followers + (isFollow ? 1 : -1),
      });
  }
}

export const getFollowedUsers = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const following = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", currentUser._id))
      .collect();

    const followedUserIds = following.map((f) => f.followingId);
    const followedUsers = await ctx.db
      .query("users")
      .collect()
      .then(users => users.filter(user => followedUserIds.includes(user._id)));

    return followedUsers;
  }
})

