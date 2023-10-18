import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const likeRouter = createTRPCRouter({
  likeTweet: protectedProcedure
    .input(z.object({ tweetID: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const isLiked = await ctx.db.like.findFirst({
          where: {
            tweetId: input.tweetID,
            userId: ctx.session.user.id,
          },
        });

        if (!isLiked) {
          await ctx.db.like.create({
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
  unlikeTweet: protectedProcedure
    .input(z.object({ tweetID: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.db.like.deleteMany({
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
