export interface User {
    id: string;
    fullname: string;
    about: string | null;
    avatar: string;
    username: string;
    followers: Follow[];
    followings: Follow[];
    _count: {
        followers: number;
        followings: number;
    }
}

export interface Follow {
    id: string;
    sender: User;
    receiver: User;
    status: "ACCEPTED" | "PENDING";
    fromId: string;
    toId: string;
}

export interface Post {
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

export interface Comment {
    id: string;
    text: string;
    userId: string;
    postId: string;
    author: User;
    post: Post;
}

export interface Like {
    id: number;
    user: User;
    userId: string;
    post: Post;
    postId: string;
}

export interface ValidationError {
    fieldName: string;
    message: string
}
