import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react";
import { Search } from "lucide-react";
import React, { useState } from "react";
import useDebounce from "~/hooks/useDebounce";
import { api } from "~/utils/api";
import CardUsers from "./CardUsers";
import { useSession } from "next-auth/react";

type IUser =
  | {
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
    }[]
  | undefined;

export default function SearchUser() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [search, setSearch] = useState("");
  const { data: session } = useSession();
  const { debouncedValue: debounce, loading } = useDebounce(search, 1000);
  // const { data } = api.user.getUsers.useQuery({ search: debounce });
  const { data: users } = api.user.getUsersAndFollowers.useQuery({search: debounce});
  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // console.log("users", users);

  return (
    <>
      <Button onPress={onOpen} variant="faded" startContent={<Search />} className="pr-28 text-gray-400">
        Search users
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody>
                <Input
                  type="email"
                  placeholder="Discover users by name or adding '@'"
                  variant="bordered"
                  startContent={<Search />}
                  onChange={onChangeSearch}
                  value={search}
                  className="border-none"
                  size="lg"
                  autoFocus
                />
                {users && users?.length <= 0 && (
                  <p>
                    users <strong>&quot;{debounce}&quot;</strong> does not exist
                  </p>
                )}
                {users?.map((user) => {
                  return (
                    <CardUsers
                    // search={debounce}
                      user={user}
                      key={user.id}
                      isUserFollowed={
                        !user.followers.find(
                          (u) => u.userId === session?.user?.id,
                        )
                      }
                    />
                  );
                })}
                {loading && <MySkeleton />}
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

function MySkeleton() {
  return (
    <Card>
      <CardBody>
        <div className="flex w-full items-center gap-3">
          <div>
            <Skeleton className="flex h-11 w-11 rounded-full" />
          </div>
          <div className="flex w-full flex-col gap-2">
            <Skeleton className="h-3 w-3/5 rounded-lg" />
            <Skeleton className="h-3 w-4/5 rounded-lg" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
