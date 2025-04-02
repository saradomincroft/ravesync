import { query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const getNotifications = query({
    handler: async (ctx) => {
        const currentUser = await getAuthenticatedUser(ctx);

        const notifications = await ctx.db.query("notifications")
            .withIndex("by_receiver", (q) => q.eq("receiverId", currentUser._id))
            .order("desc")
            .collect()

        const notificationsWithInfo = await Promise.all(
            notifications.map(async (notification) => {
                const sender = await ctx.db.get(notification.senderId)
                let post = null;
                let comment = null;
            })
        )

        return notificationsWithInfo
    }
})