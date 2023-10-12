import { Avatar, Button, Card, CardBody, Textarea } from "@nextui-org/react";
import { ImagePlus } from "lucide-react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Header from "~/components/Header";
import { type FormEvent, useState } from "react";
import AvatarUploadPage from "~/components/Upload";
import { type PutBlobResult } from "@vercel/blob";
import ImageUpload from "~/components/Upload";
import Image from "next/image";
import cover from "~/images/cover-background.png"
import dummy from "~/images/dummy.png"
import { api } from "~/utils/api";

export default function Home() {
  const { data } = useSession();
  const [content, setContent] = useState<string>("")
  const [image, setImage] = useState<PutBlobResult | null>(null);

  const postTweet = api.tweet.postTweet.useMutation({
    onSuccess() {
      setContent("")
      setImage(null)  
    },
  })
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    postTweet.mutate({
      content,
      image: image?.url
    })
  }

  return (
    <>
      <Head>
        <title>Home Tweeter</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Header /> */}
      <section className="min-h-screen bg-gray-100 pt-5">
        <main className="mx-20 grid grid-cols-3 gap-5">
          <Card className="col-span-2">
            <CardBody>
              <form className="flex w-full gap-3" onSubmit={(e) => submitHandler(e)}>
                {data?.user.image ? (
                  <Avatar src={data.user.image} />
                ) : (
                  <Avatar name={data?.user.name ?? ""} />
                )}
                <div className="w-full">
                  <Textarea
                    label="Tweet something  "
                    labelPlacement="outside"
                    placeholder="What's happening"
                    variant="underlined"
                    className="w-full"
                    onChange={(e) => setContent(e.target.value)}
                    value={content}
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      {image?.url ? (
                        <Image
                          src={image.url}
                          alt="image failed...."
                          width={200}
                          height={200}
                          className="w-40 h-40 object-cover rounded-xl"
                        />
                      ) : (
                        <ImageUpload setBlob={setImage} id="gb" />
                      )}
                    </div>
                    <Button color="primary" className="self-start" type="submit">Tweet</Button>
                  </div>
                </div>
              </form>
            </CardBody>
          </Card>

          <Card>
            <CardBody>Hastag</CardBody>
            <AvatarUploadPage setBlob={setImage} />
          </Card>
        </main>
      </section>
    </>
  );
}
