import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import * as argon2 from "argon2";

type MessageType = {
  desription: string;
  status: boolean;
};

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        name: z.string(),
        password: z.string(),
        username: z.string(),
        email: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const hashedPassword = await argon2.hash(input.password);
        await ctx.db.user.create({
          data: {
            name: input.name,
            password: hashedPassword,
            username: input.username,
            email: input.email,
          },
        });
      } catch (error) {
        console.log("Register: ", error);
      }
    }),
  checkUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        let message: MessageType = {
          desription: "Unknown Error",
          status: false,
        };

        const isUsernameExist = await ctx.db.user.findUnique({
          where: {
            username: input.username,
          },
        });

        if (isUsernameExist) {
          message = { desription: "Username already exist", status: false };
        }

        message = { desription: "Username is available", status: true };

        return message;
      } catch (error) {
        console.log("Check username:", error);
      }
    }),
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          bio: true,
          image: true,
          coverProfile: true,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }),
  getUsers: protectedProcedure
    .input(
      z.object({
        search: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        let whereCondition;

        if (!input.search) {
          return null; // No search term provided, return an empty result
        }

        if (input.search.includes("@")) {
          whereCondition = {
            username: {
              contains: input.search.replace("@", ""),
            },
          };
        } else {
          whereCondition = {
            name: {
              contains: input.search,
            },
          };
        }

        const users = await ctx.db.user.findMany({
          where: whereCondition,
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            bio: true,
            image: true,
            coverProfile: true,
          },
          take: 5,
        });

        return users;
      } catch (error) {
        console.error(error);
      }
    }),
    getUsersAndFollowers: protectedProcedure
    .input(
      z.object({
        search: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        let whereCondition;

        if (!input.search) {
          return null; // No search term provided, return an empty result
        }

        if (input.search.includes("@")) {
          whereCondition = {
            username: {
              contains: input.search.replace("@", ""),
            },
          };
        } else {
          whereCondition = {
            name: {
              contains: input.search,
            },
          };
        }
        const users =  await ctx.db.user.findMany({
          select: {
            followers: {
              where: {
                userId: ctx.session.user.id
              }
            },
            followings: true,
            id: true,
            name: true,
            username: true,
            email: true,
            bio: true,
            image: true,
            coverProfile: true,
          },
          where: whereCondition,
          take: 5
        });
        return users
      } catch (error) {
        console.log(error);
      }
    }),
  editProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().nullable().optional(),
        username: z.string().nullable().optional(),
        bio: z.string().nullable().optional(),
        image: z.string().nullable().optional(),
        coverProfile: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, username, bio, image, coverProfile } = input;
      try {
        await ctx.db.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            name,
            username,
            bio,
            image,
            coverProfile,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
