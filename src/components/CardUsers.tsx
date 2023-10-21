import { Avatar, Button, Card, CardHeader, Skeleton } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import useFollow from "~/hooks/useFollow";
import { api } from "~/utils/api";

type CardUsersProps = {
  user: {
    name: string | null;
    username: string | null;
    email: string | null;
    bio: string | null;
    image: string | null;
    coverProfile: string | null;
    id: string;
    followers: {
      id: number;
      userId: string;
      followerUserId: string;
    }[];
    followings: {
      id: number;
      userId: string;
      followerUserId: string;
    }[];
  };

  isUserFollowed: boolean;
  // search: string;
};

export default function CardUsers({
  user,
  isUserFollowed,
} // search,
: CardUsersProps) {
  // const [isFollowed, setIsFollowed] = useState(isUserFollowed);
  // const { refetch } = api.user.getUsersAndFollowers.useQuery({ search });
  // const context = api.useContext();
  // const following = api.follow.following.useMutation({
  //   async onSuccess() {
  //     await refetch();
  //     await context.user.invalidate();
  //   },
  // });
  // const unfollow = api.follow.unfollow.useMutation({
  //   async onSuccess() {
  //     await refetch();
  //     await context.user.invalidate();
  //   },
  // });
  const followerID = user.followers.map((u) => u.id);

  // const onFollowing = () => {
  //   if (isFollowed) {
  //     unfollow.mutate({ id: Number(followerID) });
  //   } else {
  //     following.mutate({ followerUserId: user.id });
  //   }
  // };

  const { data: session } = useSession();

  const { isFollowed, onFollowing, setIsFollowed } = useFollow(
    isUserFollowed,
    Number(followerID),
    user.id,
  );

  return (
    // <Link href={`/${user.username}`}>
    <Card key={user.id}>
      <CardHeader className="justify-between">
        <Link href={`/${user.username}`} className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src={user.image ?? ""}
            name={user.name ?? user.username ?? ""}
          />
          <div className="flex flex-col items-start justify-center gap-1">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {user.name}
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              @{user.username}
            </h5>
          </div>
        </Link>
        {user.id !== session?.user?.id && (
          <Button
            className={
              !isFollowed
                ? "border-default-200 bg-transparent text-foreground"
                : ""
            }
            color="primary"
            radius="full"
            size="sm"
            variant={!isFollowed ? "bordered" : "solid"}
            onPress={() => setIsFollowed(!isFollowed)}
            onClick={onFollowing}
          >
            {!isFollowed ? "Unfollow" : "Follow"}
          </Button>
        )}
      </CardHeader>
    </Card>
    // </Link>
  );
}
