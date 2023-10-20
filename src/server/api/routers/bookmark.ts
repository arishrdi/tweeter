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
  getAllBookmarks: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.bookmark.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          tweet: {
            include: {
              user: {
                select: {
                  name: true,
                  username: true,
                  bio: true,
                  image: true,
                  coverProfile: true,
                  id: true
                }
              },
              _count: {
                select: {
                  likes: true,
                  comments: true,
                  retweets: true
                },
              },
              likes: {
                where: {
                  userId: ctx.session.user.id,
                },
              },
              bookmarks: {
                where: {
                  userId: ctx.session.user.id,
                },
              },
              retweets: {
                where: {
                  userId: ctx.session.user.id,
                },
              }
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              bio: true,
              image: true,
              coverProfile: true,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
      
    }
  }),
});
