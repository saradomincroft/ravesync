import { mutation } from "./_generated/server";

export const seedData = mutation({
  args: {},
  handler: async (ctx, args) => {
    const locationData = [
      "Sydney", 
      "Melbourne", 
      "Brisbane", 
      "Perth", 
      "Adelaide", 
      "Gold Coast", 
      "Byron Bay", 
      "Townsville", 
      "Canberra", 
      "Hobart", 
      "Darwin", 
      "Newcastle", 
      "Cairns", 
    ];

    const genreData = [
        "140",
        "Acid techno",
        "Ambient",
        "Bass house",
        "Bass music",
        "Big room house",
        "Breakbeat",
        "Disco",
        "Downtempo",
        "Dub",
        "Dubstep",
        "Drum and bass",
        "EDM",
        "Electro",
        "Electro house",
        "Funky house",
        "Garage",
        "Halftime",
        "House",
        "IDM",
        "K-Pop",
        "Jungle",
        "Metal",
        "New wave",
        "Riddim",
        "Rock",
        "Synth-pop",
        "Tech house",
        "Techno",
        "Trance",
        "Trap"
    ];

    for (const location of locationData) {
      const existingLocation = await ctx.db
        .query("locations")
        .filter((q) => q.eq("name", location))
        .first();
      if (!existingLocation) {
        await ctx.db.insert("locations", { name: location });
      }
    }

    for (const genre of genreData) {
      const existingGenre = await ctx.db
        .query("genres")
        .filter((q) => q.eq("name", genre))
        .first();
      if (!existingGenre) {
        await ctx.db.insert("genres", { name: genre });
      }
    }
  },
});
