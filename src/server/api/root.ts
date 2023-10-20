import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { tweetRouter } from "./routers/tweet";
import { followerRouter } from "./routers/follower";
import { likeRouter } from "./routers/like";
import { commentRouter } from "./routers/comment";
import { bookmarkRouter } from "./routers/bookmark";
import { retweetRouter } from "./routers/retweet";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  tweet: tweetRouter,
  follow: followerRouter,
  like: likeRouter,
  comment: commentRouter,
  bookmark: bookmarkRouter,
  retweet: retweetRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
