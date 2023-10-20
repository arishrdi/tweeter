export type IUser =
  | {
      isFollowed: boolean;
      name?: string | null | undefined;
      username?: string | null | undefined;
      email?: string | null | undefined;
      bio?: string | null | undefined;
      image?: string | null | undefined;
      coverProfile?: string | null | undefined;
      id?: string | undefined;

      _count?:
        | {
            follower?: number | undefined;
            followings?: number | undefined;
            tweets?: number | undefined;
          }
        | undefined;
      followers?:
        | {
            id: number | undefined;
            userId: string | undefined;
            followerUserId: string | undefined;
          }[]
        | undefined;
      // followings: {
      //   id: number;
      //   userId: string | undefined;
      //   followerUserId: string | undefined;
      // }[] | undefined;
    }
  | null
  | undefined;

export type DefaultUser = {
  name?: string | null | undefined;
  username?: string | null | undefined;
  bio?: string | null | undefined;
  image?: string | null | undefined;
  coverProfile?: string | null | undefined;
  id?: string | undefined;
}
