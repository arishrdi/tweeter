import { api } from "~/utils/api";

export default function useBookmark(tweetID: number, isBookmarked: boolean) {
  const context = api.useContext();
  const bookmarkTweet = api.bookmark.bookmarkTweet.useMutation({
    async onSuccess() {
      await context.tweet.invalidate()

    }
  });
  const unbookmarkTweet = api.bookmark.unbookmarkTweet.useMutation({
    async onSuccess() {
      await context.tweet.invalidate()
    }
  });
  const onBookmark = () => {
    if (isBookmarked) {
      unbookmarkTweet.mutate({ tweetID });
    } else {
      bookmarkTweet.mutate({ tweetID });
    }
  };

  return { onBookmark };
}
