import {
  Avatar,
  Button,
  Card,
  CardBody,
  Input,
  Textarea,
  User,
} from "@nextui-org/react";
import Image from "next/image";
import React from "react";
import { type ITWeets } from "~/types/tweet";
import { type IUser } from "~/types/user";
import dummy from "~/images/dummy.png";
import { Bookmark, Heart, MessageSquare, RefreshCcw } from "lucide-react";
import useLike from "~/hooks/useLike";

type CardTweetProps = {
  user: IUser;
  tweet: ITWeets;
};

export default function CardTweet({ tweet, user }: CardTweetProps) {
  const isLiked = tweet.likes.length <= 0;
  console.log("Tweet", isLiked);

  const { onLike } = useLike(tweet.id, !isLiked);
  return (
    <Card>
      <CardBody>
        <User
          name={user?.name}
          description={
            tweet.createdAt.toDateString() +
            " at " +
            tweet.createdAt.getHours() +
            ":" +
            tweet.createdAt.getMinutes()
          }
          avatarProps={{ src: user?.image ?? "" }}
          className="mb-3 self-start"
        />
        <p className="whitespace-pre-wrap">{tweet?.content}</p>
        {tweet?.image && (
          <Image
            src={dummy}
            alt={tweet.content}
            width={500}
            height={500}
            className="w-full rounded-lg"
          />
        )}
        <div className="my-3 flex justify-between">
          <Button startContent={<MessageSquare size={18} />} variant="light" color="primary">
            Comments
          </Button>
          <Button startContent={<RefreshCcw size={18} />} variant="light" color="primary">
            Retweets
          </Button>
          <Button
            startContent={<Heart size={18} />}
            variant={isLiked ? "light" : "shadow"}
            onClick={onLike}
            color={isLiked ? "primary" : "danger"}
          >
            {isLiked ? "Likes" : "Liked"} ({tweet._count.likes})
          </Button>
          <Button startContent={<Bookmark size={18} />} variant="light" color="primary">
            Saved
          </Button>
        </div>
        <div className="flex gap-3">
          <Avatar name={user?.name ?? ""} src={user?.image ?? ""} />
          <Textarea
            minRows={1}
            maxRows={3}
            variant="flat"
            placeholder="tweet your reply"
          />
        </div>
      </CardBody>
    </Card>
  );
}
