import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
  Card,
  CardBody,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import React, { useMemo, useState, useEffect } from "react";
import { api } from "~/utils/api";
import cover from "~/images/cover-background.png";
import { AtSign, Pencil } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { type User } from "@prisma/client";
import ImageUpload from "~/components/Upload";
import { type PutBlobResult } from "@vercel/blob";
import { useRouter } from "next/router";
import useFollow from "~/hooks/useFollow";
import { type IUser } from "~/types/user";
import CardUsers from "~/components/CardUsers";
import CardTweet from "~/components/CardTweet";
import Link from "next/link";

export default function Profile() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const username = router.query.profile as string;
  const { data: user } = api.user.getCurrentUser.useQuery({
    username,
  });

  const { data: tweets } = api.tweet.getCurrentUserTweets.useQuery({
    username,
  });

  console.log("Profile", tweets);

  const followerID = user?.followers?.map((u) => u.id);

  const { isFollowed, onFollowing, setIsFollowed } = useFollow(
    user?.isFollowed ?? false,
    Number(followerID),
    user?.id ?? "",
  );

  if (!session) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{session.user.name ?? ""} Profile</title>
      </Head>
      <section>
        <div className="">
          <div className="relative">
            <Image
              src={user?.coverProfile ?? cover}
              alt="cover"
              width={1200}
              height={500}
              className="h-64 w-full bg-center bg-no-repeat  object-cover"
              sizes="cover"
            />
          </div>
          <div className="absolute inset-y-56 w-full">
            <Card className="mx-20 !overflow-visible">
              <div className="">
                <CardBody className="relative flex w-full  flex-row gap-10 !overflow-visible">
                  <Image
                    src={user?.image ?? cover}
                    alt="photo"
                    width={200}
                    height={200}
                    className="absolute -top-10 h-40 w-40 rounded-lg border-4 border-white object-cover"
                  />
                  <div style={{ width: "150px" }}></div>
                  <div className="w-full">
                    <div className="grid w-full grid-flow-col items-center gap-10">
                      <h1 className="text-2xl font-bold">{user?.name}</h1>
                      <span>
                        <ModalFollowing
                          userId={user?.id ?? ""}
                          name={user?.name ?? ""}
                        />
                      </span>
                      <span>
                        <ModalFollower username={user?.username ?? ""} />
                      </span>
                      {user?.id === session.user.id ? (
                        <ModalEditProfile user={user} />
                      ) : (
                        // <p>mbuj</p>
                        <Button
                          className={
                            !user?.isFollowed
                              ? "border-default-200 bg-transparent text-foreground"
                              : ""
                          }
                          color="primary"
                          radius="full"
                          size="sm"
                          variant={!user?.isFollowed ? "bordered" : "solid"}
                          onPress={() => setIsFollowed(!isFollowed)}
                          onClick={onFollowing}
                        >
                          {!user?.isFollowed ? "Follow" : "Unfollow"}
                        </Button>
                      )}
                    </div>
                    <p className="min-h-[60px] whitespace-pre-wrap">
                      {" "}
                      {user?.bio ?? ""}
                    </p>
                  </div>
                </CardBody>
              </div>
            </Card>
            <div className="mx-20 mt-10 grid grid-cols-3 gap-10">
              <div className="col-span-1">
                <Card className="">
                  <CardBody>
                    <Listbox variant="faded" color="primary">
                      <ListboxItem key="tweet" className="text-primary">
                        Tweet
                      </ListboxItem>
                      <ListboxItem key="reply">Tweet & Replies</ListboxItem>
                      <ListboxItem key="media">Media</ListboxItem>
                      <ListboxItem key="like">LIkes</ListboxItem>
                    </Listbox>
                  </CardBody>
                </Card>
              </div>
              <div className="col-span-2">
                <div className=" flex flex-col gap-10">
                  {tweets?.map((tweet, i) => {
                    return (
                      <CardTweet key={i} tweet={tweet} user={tweet?.user} isUsingRetweet  />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="mx-20 mt-14 grid grid-cols-3 gap-5">
          <div className="col-span-1">
            <Card className="">
              <CardBody>
                <Listbox variant="faded" color="primary">
                  <ListboxItem key="tweet">Tweet</ListboxItem>
                  <ListboxItem key="reply">Tweet & Replies</ListboxItem>
                  <ListboxItem key="media">Media</ListboxItem>
                  <ListboxItem key="like">LIkes</ListboxItem>
                </Listbox>
              </CardBody>
            </Card>
          </div>
          <div className="col-span-2">
            <div className=" flex flex-col gap-5">
              {tweets?.tweets.map((tweet) => {
                return <CardTweet key={tweet.id} tweet={tweet} user={user} />;
              })}
            </div>
          </div>
        </div> */}
      </section>
    </>
  );
}

type UserType = {
  id: string | null;
  name: string | null;
  image: string | null;
  username: string | null;
  email: string | null;
  bio: string | null;
  coverProfile: string | null;
};

type ModalEditProfileProps = {
  user: IUser;
};

function ModalEditProfile({ user }: ModalEditProfileProps) {
  const { data: session, update } = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [image, setImage] = useState<PutBlobResult | null>(null);
  const [coverProfile, setCoverProfile] = useState<PutBlobResult | null>(null);
  const context = api.useContext();
  const editProfile = api.user.editProfile.useMutation({
    async onSuccess(d, data) {
      await context.user.getCurrentUser.refetch();

      // await update({ ...data });
      await update({ ...data, id: user?.id });
      console.log("Data Update", user);
    },
  });
  // console.log("Image", image, coverProfile);

  const { register, handleSubmit } = useForm<User>();

  const onSubmitHandler: SubmitHandler<UserType> = async (data) => {
    // console.log(data);
    editProfile.mutate({
      ...data,
      image: image?.url,
      coverProfile: coverProfile?.url,
    });
    // await update({ ...user });
  };

  return (
    <>
      <Button
        onPress={onOpen}
        className="justify-self-end"
        startContent={<Pencil size={15} />}
        color="primary"
        variant="faded"
      >
        Edit
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <form onSubmit={handleSubmit(onSubmitHandler)}>
                <ModalHeader>Edit Profile</ModalHeader>
                <ModalBody>
                  <div className="relative">
                    <div className="relative -mx-6 grid place-items-center">
                      <Image
                        src={
                          coverProfile?.url ?? user?.coverProfile ?? cover ?? ""
                        }
                        alt=""
                        width={400}
                        height={400}
                        className="h-48 w-full bg-gray-300 brightness-75"
                      />
                      <ImageUpload
                        className="absolute z-10 text-gray-300"
                        setBlob={setCoverProfile}
                        id="cover"
                      />
                    </div>
                    <div className="absolute inset-x-0 -bottom-7 -left-56">
                      <div className="relative -left-0 grid place-items-center">
                        <Avatar
                          isBordered
                          color="success"
                          src={image?.url ?? user?.image ?? session?.user.image}
                          alt="cover"
                          className="h-24 w-24 brightness-75"
                        />
                        <ImageUpload
                          className="absolute z-10 text-gray-300"
                          setBlob={setImage}
                          id="image"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 flex flex-col gap-3">
                    <Input
                      variant="bordered"
                      type="text"
                      label="Name"
                      defaultValue={user?.name ?? ""}
                      {...register("name")}
                    />
                    <Input
                      variant="bordered"
                      type="text"
                      label="Username"
                      defaultValue={user?.username ?? ""}
                      startContent={
                        <AtSign size={15} className="text-gray-500" />
                      }
                      {...register("username")}
                    />
                    <Textarea
                      variant="bordered"
                      label="Bio"
                      defaultValue={user?.bio ?? ""}
                      {...register("bio")}
                    />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" type="submit" onPress={onClose}>
                    Save
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

type ModalFollowerProps = {
  newUser?: IUser;
  username?: string;
  name?: string;
  userId?: string;
};

function ModalFollower({ username }: ModalFollowerProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: user } = api.follow.getCurrentUserFollowers.useQuery({
    username,
  });
  return (
    <>
      <Button onPress={onOpen} variant="light">
        <strong>{user?.followers.length}</strong>Follower
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {user?.name}&apos;s Followers
              </ModalHeader>
              <ModalBody>
                {user?.followers.map((u) => {
                  return (
                    <div key={u.id}>
                      <p>{u.user.name}</p>
                    </div>
                  );
                })}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
function ModalFollowing({ userId, name }: ModalFollowerProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: user } = api.follow.getCurrentUserFollowings.useQuery({
    userId,
  });
  // console.log("Following", user);

  return (
    <>
      <Button onPress={onOpen} variant="light">
        <strong> {user?.length}</strong> Followings
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {name} is Following
              </ModalHeader>
              <ModalBody>
                {user?.map((u) => {
                  return (
                    <div key={u.id}>
                      <p>{u.followingUser.name}</p>
                    </div>
                  );
                })}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
