import { useSession } from "next-auth/react";
import Head from "next/head";
import React, { useEffect, useRef } from "react";
import CardTweet from "~/components/CardTweet";
import { api } from "~/utils/api";
// import Masonry from "masonry-layout"

export default function Bookmarks() {
  const { data: tweets } = api.bookmark.getAllBookmarks.useQuery();
  const {data: session} = useSession()

  return (
    <>
      <Head>
        <title>{session?.user?.name}&apos;s Bookmarks</title>
     </Head>
      <div
        className="mx-20 columns-2 gap-5 mt-5"
      >
        {tweets?.map((tweet, i) => {
          return (
            <div key={i} className="mb-5">
              <CardTweet tweet={tweet.tweet} user={tweet.tweet.user} />
            </div>
          );
        })}
      </div>
    </>
  );
}
