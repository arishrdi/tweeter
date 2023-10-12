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
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Header from "~/components/Header";
import { api } from "~/utils/api";
import cover from "~/images/cover-background.png";
import { AtSign, Pencil } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { type User } from "@prisma/client";
import ImageUpload from "~/components/Upload";
import { type PutBlobResult } from "@vercel/blob";

export default function Profile() {
  const { data: session, update } = useSession();
  const { data: user, refetch } = api.user.getCurrentUser.useQuery();

  if (!session) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{session.user.name ?? ""} Profile</title>
      </Head>
      {/* <Header /> */}
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
                    width={150}
                    height={150}
                    className="absolute -top-10 rounded-lg border-4 border-white"
                  />
                  <div style={{ width: "150px" }}></div>
                  <div className="w-full">
                    <div className="grid w-full grid-flow-col items-center gap-10">
                      <h1 className="text-2xl font-bold">{user?.name}</h1>
                      <span>
                        <strong>2333</strong> following
                      </span>
                      <span>
                        <strong>2333</strong> follower
                      </span>
                      <Button
                        className="justify-self-end"
                        startContent={<Pencil size={15} />}
                        color="primary"
                        variant="faded"
                      >
                        Edit
                      </Button>
                    </div>
                    <article className="mt-5 min-h-[30px]">{user?.bio}</article>
                  </div>
                </CardBody>
              </div>
            </Card>
          </div>
        </div>
        <ModalEditProfile user={user} />
        <br />
        {user?.id} | {session.user.id} <br />
        {user?.name} | {session.user.name} <br />
        {user?.image} | {session.user.image} <br />
        {user?.username} <br />
        {user?.bio} <br />
        <Button onClick={() => void update()}>Session</Button>
      </section>
    </>
  );
}

type IUser = {
  id: string | null;
  name: string | null;
  image: string | null;
  username: string | null;
  email: string | null;
  bio: string | null;
  coverProfile: string | null;
};

type ModalEditProfileProps = {
  user: IUser | undefined | null;
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

  const onSubmitHandler: SubmitHandler<IUser> = async (data) => {
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
      <Button onPress={onOpen}>Edit Profile</Button>
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
