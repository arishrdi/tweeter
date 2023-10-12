import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { tweetRouter } from "./routers/tweet";
import { followerRouter } from "./routers/follower";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  tweet: tweetRouter,
  follow: followerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
