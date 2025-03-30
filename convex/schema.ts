import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
    users: defineTable({
        username: v.string(),
        fullname: v.string(),
        email: v.string(),
        bio: v.optional(v.string()),
        image: v.optional(v.string()),
        followers: v.number(),
        following: v.number(),
        posts: v.number(),
        followedGenres: v.array(v.id("genres")),
        location: v.optional(v.id("locations")),
        clerkId: v.string(),
    }).index("by_clerk_id", ["clerkId"]),

    posts: defineTable({
        userId: v.id("users"), // owner of post
        imageUrl: v.string(),
        storageId: v.id("_storage"), // needed when deleting post
        caption: v.optional(v.string()),
        likes: v.number(),
        comments: v.number(),
        genre: v.id("genres"),
        location: v.id("locations"),
    })
        .index("by_user", ["userId"])
        .index("by_genre_location", ["genre", "location"]),

    genres: defineTable({
        name: v.string(),
    }),

    locations: defineTable({
        name: v.string(),
    }),

    likes: defineTable({
        userId: v.id("users"),
        postId: v.id("posts"),
    })
        .index("by_post", ["postId"])
        .index("by_user_and_post", ["userId", "postId"]),

    comments: defineTable({
        userId: v.id("users"), // comment author
        postId: v.id("posts"), // which post comment is on
        content: v.string(),
    }).index("by_post", ["postId"]),

    follows: defineTable({
        followerId: v.id("users"),
        followingId: v.id("users"),
    })
        .index("by_follower", ["followerId"])
        .index("by_following", ["followingId"])
        .index("by_both", ["followerId", "followingId"]),

    notifications: defineTable({
        receiverId: v.id("users"),
        senderId: v.id("users"),
        type: v.union(v.literal("like"), v.literal("comment"), v.literal("follow")),
        postId: v.optional(v.id("posts")),
        commentId: v.optional(v.id("comments")),
    }).index("by_receiver", ["receiverId"]),

    chats: defineTable({
        genre: v.id("genres"),
        location: v.id("locations"),
        participants: v.array(v.id("users")), // Users in the chat
        messages: v.array(v.object({ userId: v.id("users"), content: v.string() })), // Chat messages
    }).index("by_genre_location", ["genre", "location"]),

    favouriteChats: defineTable({
        userId: v.id("users"), // User who favourited the chat
        chatId: v.id("chats"), // The chat that has been favourited
    })
        .index("by_user", ["userId"])
        .index("by_chat", ["chatId"]),

    bookmark: defineTable({
        userId: v.id("users"),
        postId: v.id("posts"),
    })
        .index("by_user", ["userId"])
        .index("by_post", ["postId"])
        .index("by_user_and_post", ["userId", "postId"]),
});
