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
  getCurrentUserTweets: protectedProcedure
    .input(
      z.object({
        username: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.user.findUnique({
          where: {
            username: input.username,
          },
          select: {
            tweets: {
              orderBy: { createdAt: "desc" },
              include: {
                _count: {
                  select: {
                    likes: true,
                  },
                },
                likes: {
                  where: {
                    userId: ctx.session.user.id,
                  },
                },
              },
            },
            // likes: {
            //   where: {
            //     userId: ctx.session.user.id,
            //   },
            // },
            id: true,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
