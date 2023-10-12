import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const tweetRouter = createTRPCRouter({
  postTweet: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        image: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { content, image } = input;
      try {
        await ctx.db.tweet.create({
          data: {
            content,
            image,
            userId: ctx.session?.user.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
