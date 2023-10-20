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
        const retweet = await ctx.db.retweet.findMany({
          where: {
            userId: ctx.session.user.id
          },
          select: {
            tweet: {
              include: {
                _count: {
                  select: {
                    likes: true,
                    comments: true,
                    retweets: true
                  }
                },
                user: true,
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
            }
          }
        })
        const tweet =  await ctx.db.user.findUnique({
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
                    comments: true,
                    retweets: true,
                  },
                },
                user: true,
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

        const newTweet = tweet?.tweets.map((t) => t)
        const newRetweet = retweet.map((t) => t.tweet).map((x) => x)
        const newTweets = [newTweet, newRetweet] 
        return newTweets.flat(2)
      } catch (error) {
        console.log(error);
      }
    }),
    getAllTweets: protectedProcedure
    .query(async({ctx}) => {
      try {

        const followingTweets = await ctx.db.follower.findMany({
          where: {
            userId: ctx.session.user.id
          },
          select: {
            followingUser: {
              select: {
                tweets: {
                  orderBy: {
                    createdAt: "desc"
                  },
                  include: {
                    _count: {
                      select: {
                        likes: true,
                        comments: true,
                        retweets: true
                      },
                    },
                  user: true,
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
                  },
                }
              }
            }
          }
        })

        const retweetingTweets = await ctx.db.retweet.findMany({
          where: {
            userId: ctx.session.user.id
          },
          select: {
            tweet: {
              include: {
                _count: {
                  select: {
                    likes: true,
                    comments: true,
                    retweets: true
                  }
                },
                user: true,
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
            }
          }
        })

        const currentUserTweets = await ctx.db.user.findUnique({
          where: {
            id: ctx.session.user.id
          },
          select: {
            tweets: {
              orderBy: {
                createdAt: "desc"
              },
              include: {
                _count: {
                  select: {
                    likes: true,
                    comments: true,
                    retweets: true
                  },
                },
                user: true,
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
              },
            }
          }
        })

        const newCurrentUserTweets = currentUserTweets?.tweets  

        const newFollowingTweets = followingTweets.map((t) => t.followingUser.tweets).map((u) => u)
        const filterFollowingTweets = newFollowingTweets.filter((t) => t.length >= 1).map((u) => u)

        const newRetweet = retweetingTweets.map((t) => t.tweet)
        const newTweets = [newCurrentUserTweets,filterFollowingTweets] 

        return newTweets.flat(2)
      } catch (error) {
        
      }
    })
});
