import { useState } from "react";
import { type IUser } from "~/types/user";
import { api } from "~/utils/api";

export default function useFollow(
  isUserFollowed: boolean,
  followerID: number,
  // user: IUser,
  userID: string
) {
  const [isFollowed, setIsFollowed] = useState(isUserFollowed);

  const context = api.useContext();

  const following = api.follow.following.useMutation({
    async onSuccess() {
      await context.user.invalidate();
      await context.follow.invalidate();
      },
    });
    const unfollow = api.follow.unfollow.useMutation({
      async onSuccess() {
        await context.user.invalidate();
        await context.follow.invalidate();
    },
  });

  const onFollowing = () => {
    if (isUserFollowed) {
      unfollow.mutate({ id: Number(followerID) });
    } else {
      following.mutate({ followerUserId: userID ?? "" });
    }
  };

  return { isFollowed, setIsFollowed, onFollowing };
}
