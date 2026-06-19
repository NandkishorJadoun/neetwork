import type { Post } from "../types"

type FetchPostsResponse = {
    posts: Post[]
    nextCursor: string
}

type FetchPostsArgs = {
    token?: string
    posts?: 'following'
    nextCursor: string
}

export const fetchFeedPosts = async ({ token, posts, nextCursor }: FetchPostsArgs): Promise<FetchPostsResponse> => {
    const url = `${import.meta.env.VITE_API_URL}/posts${posts ? '/following' : ''}?cursor=${nextCursor}`
    const options = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    const res = await fetch(url, options)
    if (!res.ok) throw new Error('Network response failed');
    return res.json();
}