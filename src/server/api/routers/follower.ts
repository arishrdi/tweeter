import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const followerRouter = createTRPCRouter({
  following: protectedProcedure
    .input(
      z.object({
        followerUserId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { followerUserId } = input;
      try {
        await ctx.db.follower.create({
          data: {
            followerUserId,
            userId: ctx.session?.user.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  unfollow: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      try {
        await ctx.db.follower.delete({
          where: {
            id
          }
          // data: {
          //   followerUserId,
          //   userId: ctx.session?.user.id,
          // },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
