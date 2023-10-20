import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const retweetRouter = createTRPCRouter({
  retweet: protectedProcedure
    .input(z.object({ tweetID: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const isLiked = await ctx.db.retweet.findFirst({
          where: {
            tweetId: input.tweetID,
            userId: ctx.session.user.id,
          },
        });

        if (!isLiked) {
          await ctx.db.retweet.create({
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
  unretweet: protectedProcedure
    .input(z.object({ tweetID: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.db.retweet.deleteMany({
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
