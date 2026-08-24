import type { ActiveTab } from "../routes/_authenticated/home"
import type { Post } from "../types"

type FetchPostsResponse = {
    posts: Post[]
    nextCursor: string
}

type FetchPostsArgs = {
    token: string
    activeTab: ActiveTab
    nextCursor: string
}

export const fetchFeedPosts = async ({ token, activeTab, nextCursor }: FetchPostsArgs): Promise<FetchPostsResponse> => {
    const url = `${import.meta.env.VITE_API_URL}/posts?users=${activeTab}&cursor=${nextCursor}`
    console.log(url)
    const options = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    const res = await fetch(url, options)
    if (!res.ok) throw new Error('Network response failed');
    return res.json();
}