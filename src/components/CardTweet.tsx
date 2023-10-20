import {
  Avatar,
  Button,
  Card,
  CardBody,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
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
import React, { type FormEvent, useState } from "react";
import { type ITWeets } from "~/types/tweet";
import { type DefaultUser, type IUser } from "~/types/user";
import dummy from "~/images/dummy.png";
import { Bookmark, Heart, MessageSquare, RefreshCcw, Send } from "lucide-react";
import useLike from "~/hooks/useLike";
import { useSession } from "next-auth/react";
import { type User as UserType } from "@prisma/client";
import { api } from "~/utils/api";
import useBookmark from "~/hooks/useBookmark";
import useRetweet from "~/hooks/useRetweet";

type CardTweetProps = {
  user: DefaultUser | null | undefined;
  tweet: ITWeets;
  isUsingRetweet?: boolean
};

export default function CardTweet({ tweet, user, isUsingRetweet }: CardTweetProps) {
  const isLiked = (tweet?.likes.length ?? 0) <= 0;
  const isBookmarked = (tweet?.bookmarks.length ?? 0) <= 0;
  const isRetweet = (tweet?.retweets.length ?? 0) <= 0;
  // console.log("Tweet", tweet);
  const { data: session } = useSession();
  const [messageComment, setMessageComment] = useState("");
  const context = api.useContext();

  const { onLike } = useLike(tweet?.id ?? 0, !isLiked);
  const { onBookmark } = useBookmark(tweet?.id ?? 0, !isBookmarked);
  const { onRetweet } = useRetweet(tweet?.id ?? 0, !isRetweet);

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
        {
          isUsingRetweet && tweet.userId !== session?.user.id ? <p className="text-tiny text-foreground-400 flex items-center gap-3 mb-3"><RefreshCcw size={15} />Retweet</p> : null
        }
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
            onClick={onRetweet}
            color={isRetweet ? "primary" : "danger"}
          >
            Retweets ({tweet._count.retweets})
          </Button>
          <Button
            startContent={<Heart size={18} />}
            variant="light"
            onClick={onLike}
            color={isLiked ? "primary" : "danger"}
          >
            Likes ({tweet._count.likes})
          </Button>
          <Button
            startContent={<Bookmark size={18} />}
            variant="light"
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

type ModalProps = {
  tweetID: number;
  count?: number;
};

function ModalComment({ tweetID, count }: ModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: comments } = api.comment.getTweetComments.useQuery({ tweetID });

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
          <>
            <ModalHeader className="flex flex-col gap-1">
              Comments ({count})
            </ModalHeader>
            <ModalBody>
              {comments?.length
                ? comments.map((comment, i) => {
                    return (
                      <>
                        <div key={i} className="mb-1 flex gap-3">
                          <Avatar
                            name={comment.user.name ?? ""}
                            src={comment.user.image ?? ""}
                          />
                          <div className="w-full rounded-lg bg-gray-200/50 p-3 dark:bg-white/10">
                            <div className="flex items-center gap-3">
                              <p className="font-bold">{comment.user.name}</p>
                              <span className="text-foreground">
                                @{comment.user.username} ·{" "}
                                {comment.createdAt.toDateString()}
                              </span>
                            </div>
                            <p className="whitespace-pre-wrap text-gray-700 dark:text-white">
                              {comment.message}
                            </p>
                          </div>
                        </div>
                      </>
                    );
                  })
                : "There is no comment on this tweet"}
            </ModalBody>
            <ModalFooter></ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}

// type ModalRetweetProps = {
//   user: DefaultUser | null | undefined;
//   tweet: ITWeets;
// };
// function ModalQuote({ tweet, user }: ModalRetweetProps) {
//   const { isOpen, onOpen, onOpenChange } = useDisclosure();

//   return (
//     <>
//         {/* <DropdownItem onPress={onOpen} key="quote">Quote</DropdownItem> */}

//       <Button
//         onPress={onOpen}
//         startContent={<RefreshCcw size={18} />}
//         variant="light"
//         color="primary"
//       >
//         Quote
//       </Button>
//       <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
//         <ModalContent>
//           <>
//             <ModalHeader className="flex flex-col gap-1">
//               Retweet this tweet
//             </ModalHeader>
//             <ModalBody>
//               <Textarea
//                 // label="Tweet something  "
//                 // labelPlacement="outside"
//                 placeholder="What's happening to this tweet"
//                 variant="underlined"
//                 className="w-full"
//                 minRows={1}
//               />
//               <div className="rounded-lg border border-gray-300 p-3">
//                 <p className="flex items-center gap-3 mb-3">
//                   <RefreshCcw size={15} />
//                   Retweet from
//                 </p>
//                 <div className="flex items-center gap-3 text-tiny text-foreground">
//                   <Avatar
//                     name={user?.name ?? ""}
//                     src={user?.image ?? ""}
//                     size="sm"
//                   />
//                   <p>
//                     {user?.name} | @{user?.username}
//                   </p>
//                 </div>
//                 <p className="mt-3 whitespace-pre-wrap">{tweet?.content}</p>
//               </div>
//             </ModalBody>
//             <ModalFooter>
//               <Button color="primary">Retweet</Button>
//             </ModalFooter>
//           </>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// }

// function RetweetButton({tweet, user}: ModalRetweetProps) {
//   return (
//     <Dropdown>
//       <DropdownTrigger>
//       <Button
//         startContent={<RefreshCcw size={18} />}
//         variant="light"
//         color="primary"
//       >
//         Retweets
//       </Button>
//       </DropdownTrigger>
//       <DropdownMenu aria-label="Static Actions">
//         <DropdownItem key="new">Retweet</DropdownItem>
//         <DropdownItem key="new">Retweet</DropdownItem>
//         <ModalQuote user={user} tweet={tweet} />
//       </DropdownMenu>
//     </Dropdown>
//   )
// }
