import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const commentRouter = createTRPCRouter({
  postComment: protectedProcedure
    .input(z.object({ message: z.string(), tweetID: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.db.comment.create({
          data: {
            message: input.message,
            tweetId: input.tweetID,
            userId: ctx.session.user.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  getTweetComments: protectedProcedure
    .input(z.object({ tweetID: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.db.comment.findMany({
          where: {
            tweetId: input.tweetID,
          },
          select: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                // email: true,
                bio: true,
                image: true,
                coverProfile: true,
              }
            },
            id: true,
            message: true,
            createdAt: true
          }
        });
      } catch (error) {}
    }),
});
