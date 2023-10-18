import { api } from "~/utils/api";

export default function useLike(tweetID: number, isLiked: boolean) {
  const context = api.useContext();
  const likeTweet = api.like.likeTweet.useMutation({
    async onSuccess() {
      // await context.like.invalidate()
      await context.tweet.invalidate()
    }
  });
  const unlikeTweet = api.like.unlikeTweet.useMutation({
    async onSuccess() {
      // await context.like.invalidate()
      await context.tweet.invalidate()
    }
  });
  const onLike = () => {
    if (isLiked) {
      unlikeTweet.mutate({ tweetID });
    } else {
      likeTweet.mutate({ tweetID });
    }
  };

  return { onLike };
}
