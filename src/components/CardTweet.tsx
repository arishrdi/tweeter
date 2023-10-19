import {
  Avatar,
  Button,
  Card,
  CardBody,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  User,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import React, { FormEvent, useState } from "react";
import { type ITWeets } from "~/types/tweet";
import { type IUser } from "~/types/user";
import dummy from "~/images/dummy.png";
import { Bookmark, Heart, MessageSquare, RefreshCcw, Send } from "lucide-react";
import useLike from "~/hooks/useLike";
import { useSession } from "next-auth/react";
import { type User as UserType } from "@prisma/client";
import { api } from "~/utils/api";
import useBookmark from "~/hooks/useBookmark";

type CardTweetProps = {
  user: UserType | null | undefined;
  tweet: ITWeets;
};

export default function CardTweet({ tweet, user }: CardTweetProps) {
  // const isLiked = tweet.likes.length <= 0;
  const isLiked = (tweet?.likes.length ?? 0) <= 0;
  const isBookmarked = (tweet?.bookmarks.length ?? 0) <= 0;
  // console.log("Tweet", tweet);
  const { data: session } = useSession();
  const [messageComment, setMessageComment] = useState("");
  const context = api.useContext();

  const { onLike } = useLike(tweet?.id ?? 0, !isLiked);
  const { onBookmark } = useBookmark(tweet?.id ?? 0, !isBookmarked);

  const postComment = api.comment.postComment.useMutation({
    async onSuccess() {
      setMessageComment("");
      await context.tweet.getAllTweets.invalidate();
      await context.comment.getTweetComments.invalidate();
      await context.tweet.getCurrentUserTweets.invalidate();
    },
  });
  const onCommentHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postComment.mutate({
      message: messageComment,
      tweetID: tweet?.id ?? 0,
    });
  };

  if (!tweet) {
    return null;
  }

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
          <ModalComment tweetID={tweet.id} count={tweet._count.comments} />
          <Button
            startContent={<RefreshCcw size={18} />}
            variant="light"
            color="primary"
          >
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
          <Button
            startContent={<Bookmark size={18} />}
            variant={isBookmarked ? "light" : "shadow"}
            onClick={onBookmark}
            color={isBookmarked ? "primary" : "danger"}
          >
            {isBookmarked ? "Save" : "Saved"}
          </Button>
        </div>
        <Divider />
        <div className="mt-5 flex space-x-5">
          <div className="w-min">
            <Avatar
              name={session?.user.name ?? ""}
              src={session?.user.image ?? ""}
            />
          </div>
          <form
            className="relative w-full"
            onSubmit={(e) => onCommentHandler(e)}
          >
            <Textarea
              className=" w-full"
              minRows={2}
              maxRows={4}
              variant="bordered"
              placeholder="Tweet your reply...."
              value={messageComment}
              onValueChange={setMessageComment}
            />
            <Button
              className="absolute bottom-3 right-8"
              isIconOnly
              color="primary"
              variant="light"
              type="submit"
            >
              <Send />
            </Button>
          </form>
        </div>
      </CardBody>
    </Card>
  );
}

type ModalCommentProps = {
  tweetID: number;
  count: number;
};

function ModalComment({ tweetID, count }: ModalCommentProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: comments } = api.comment.getTweetComments.useQuery({ tweetID });
  // console.log("Comments", comments);

  return (
    <>
      <Button
        onPress={onOpen}
        startContent={<MessageSquare size={18} />}
        variant="light"
        color="primary"
      >
        Comments ({count})
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Comments ({count})
              </ModalHeader>
              <ModalBody>
                {/* <div className="grid grid-cols-1 divide-y gap-5 place-items-center  "> */}
                {comments?.length
                  ? comments.map((comment) => {
                      return (
                        <>
                          <div key={comment.id} className="mb-1 flex gap-3">
                            <Avatar
                              name={comment.user.name ?? ""}
                              src={comment.user.image ?? ""}
                            />
                            <div className="w-full rounded-lg bg-gray-200/50 p-3">
                              <div className="flex items-center gap-3">
                                <p className="font-bold">{comment.user.name}</p>
                                <span className=" text-foreground-400">
                                  @{comment.user.username} ·{" "}
                                  {comment.createdAt.toDateString()}
                                </span>
                              </div>
                              <p className="text-gray-700 whitespace-pre-wrap">{comment.message}</p>
                            </div>
                          </div>
                          {/* <Divider /> */}
                        </>
                      );
                    })
                  : "There is no comment on this tweet"}
                {/* </div> */}
              </ModalBody>
              <ModalFooter>
                {/* <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
