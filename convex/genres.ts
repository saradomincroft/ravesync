// convex/functions/genres.ts
import { mutation, query } from "./_generated/server";

export const getGenres = query({
    handler: async (ctx) => {
      return await ctx.db.query("genres").collect();
    },
  });
  
  // Query to fetch locations
  export const getLocations = query({
    handler: async (ctx) => {
      return await ctx.db.query("locations").collect();
    },
  });