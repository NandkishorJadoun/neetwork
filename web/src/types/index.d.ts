export type User = {
    id: string;
    fullname: string;
    about: string | null;
    avatar: string | null;
    username: string;
    followers: Follow[];
    followings: Follow[];
}

export type Follow = {
    id: string;
    sender: User;
    receiver: User;
    status: "ACCEPTED" | "PENDING";
    fromId: string;
    toId: string;
}

export type Post = {
    id: string;
    text: string;
    created_at: Date;
    userId: string;
    author: User;
    likes: Like[];
    comments: Comment[];
    _count: {
        likes: number;
        comments: number;
    }
}

export type Comment = {
    id: string;
    text: string;
    userId: string;
    postId: string;
    author: User;
    post: Post;
}

export type Like = {
    id: number;
    user: User;
    userId: string;
    post: Post;
    postId: string;
}

export type ValidationError = {
  fieldName: string;
  message: string
}
