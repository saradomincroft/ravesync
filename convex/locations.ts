import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const getLocations = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const user = args.userId ? await ctx.db.get(args.userId) : await getAuthenticatedUser(ctx);

    if (!user) throw new Error("User not found");

    const locations = await ctx.db
      .query("locations")
      .collect()

    return locations;
  }
});
