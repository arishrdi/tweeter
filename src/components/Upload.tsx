import { Button, Spinner } from "@nextui-org/react";
import type { PutBlobResult } from "@vercel/blob";
import { ImagePlus } from "lucide-react";
import {
  useRef,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";

type ImageUploadProps = {
  setBlob: Dispatch<SetStateAction<PutBlobResult | null>>;
  className?: string;
  id?: string;
};

export default function ImageUpload({
  setBlob,
  className,
  id,
}: ImageUploadProps) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    console.log("Uploading image....");

    event.preventDefault();
    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }

    const file = inputFileRef.current.files[0];

    if (file) {
      const response = await fetch(`/api/upload/image?filename=${file.name}`, {
        method: "POST",
        body: file,
      });

      const newBlob = (await response.json()) as PutBlobResult;

      setBlob(newBlob);
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      {loading ? (
        <Spinner />
      ) : (
        <Button isIconOnly variant="light">
          <label htmlFor={id} className="cursor-pointer">
            <ImagePlus />
          </label>
        </Button>
      )}
      <input
        id={id}
        name="file"
        ref={inputFileRef}
        type="file"
        accept="image/*"
        onChange={(e) => void onSubmitHandler(e)}
        className="sr-only"
      />
    </div>
  );
}
