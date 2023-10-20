import { api } from "~/utils/api";

export default function useRetweet(tweetID: number, isRetweet: boolean) {
  const context = api.useContext();
  const retweet = api.retweet.retweet.useMutation({
    async onSuccess() {
      await context.tweet.invalidate()
    }
  });
  const unretweet = api.retweet.unretweet.useMutation({
    async onSuccess() {
      await context.tweet.invalidate()
    }
  });
  const onRetweet = () => {
    if (isRetweet) {
      unretweet.mutate({ tweetID });
    } else {
      retweet.mutate({ tweetID });
    }
  };

  return { onRetweet };
}
