export type ITWeets = {
  _count: {
    likes: number;
    comments: number;
  };
  likes: {
    id: number;
    userId: string;
    tweetId: number;
  }[];
} & {
  id: number;
  userId: string;
  content: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
} | undefined;
