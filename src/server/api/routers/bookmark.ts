import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const bookmarkRouter = createTRPCRouter({
  bookmarkTweet: protectedProcedure
    .input(z.object({ tweetID: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const isBookmarked = await ctx.db.bookmark.findFirst({
          where: {
            tweetId: input.tweetID,
            userId: ctx.session.user.id,
          },
        });

        if (!isBookmarked) {
          await ctx.db.bookmark.create({
            data: {
              tweetId: input.tweetID,
              userId: ctx.session.user.id,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    }),
  unbookmarkTweet: protectedProcedure
    .input(z.object({ tweetID: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.db.bookmark.deleteMany({
          where: {
            tweetId: input.tweetID,
            userId: ctx.session.user.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
