import { Card, CardBody, Input } from "@nextui-org/react";
import { Search } from "lucide-react";
import Head from "next/head";
import React, {  useState } from "react";
import Container from "~/components/Container";
import useDebounce from "~/hooks/useDebounce";
import { api } from "~/utils/api";

export default function Explore() {
  const [search, setSearch] = useState("");
  const {debouncedValue: debounce, loading} = useDebounce(search, 1000);
  const { data } = api.user.getUsers.useQuery({ search: debounce });
  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <Head>
        <title>Explore</title>
      </Head>
      <Container>
        <Card>
          <CardBody>
            <Input
              type="email"
              placeholder="search users"
              variant="underlined"
              startContent={<Search />}
              onChange={onChangeSearch}
              value={search}
            />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p>{loading && "Loading...."}</p>
            <p>{data && data?.length <= 0 && "users doesnt exist"}</p>
            {data?.map((user) => {
              return (
                <div key={user.id}>
                  <p>NAme{user.name}</p>
                  <p>USername{user.username}</p>
                  <p>Email{user.email}</p>
                  <hr />
                </div>
              );
            })}
          </CardBody>
        </Card>
      </Container>
    </>
  );
}
