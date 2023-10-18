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
        const isFollowed = await ctx.db.follower.findMany({
          where: {
            followerUserId,
            userId: ctx.session.user.id,
          },
        });

        if (isFollowed.length <= 0) {
          return await ctx.db.follower.create({
            data: {
              followerUserId,
              userId: ctx.session?.user.id,
            },
          });
        }

        throw new Error("user was followed");
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
            id,
          },
          // data: {
          //   followerUserId,
          //   userId: ctx.session?.user.id,
          // },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  getCurrentUserFollowers: protectedProcedure
    .input(
      z.object({
        username: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        let whereCondition;
        if (input.username) {
          whereCondition = {
            username: input.username,
          };
        } else {
          whereCondition = {
            id: ctx.session.user.id,
          };
        }
        const user = await ctx.db.user.findUnique({
          where: whereCondition,
          select: {
            followers: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                    bio: true,
                    image: true,
                    coverProfile: true,
                  },
                },
              },
            },
            id: true,
            name: true,
            username: true,
            email: true,
            bio: true,
            image: true,
            coverProfile: true,
          },
        });
        return user;
      } catch (error) {
        console.log(error);
      }
    }),
  getCurrentUserFollowings: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        let whereCondition;
        if (input.userId) {
          whereCondition = {
            userId: input.userId,
          };
        } else {
          whereCondition = {
            userId: ctx.session.user.id,
          };
        }
        const user = await ctx.db.follower.findMany({
          where: whereCondition,
          include: {
            followingUser: {
              select: {
                id: true,
                name: true,
                username: true,
                email: true,
                bio: true,
                image: true,
                coverProfile: true,
              },
            },
          },
        });
        return user;
      } catch (error) {
        console.log(error);
      }
    }),
});
