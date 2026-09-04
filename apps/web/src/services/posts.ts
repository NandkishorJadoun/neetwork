import type { ActiveTab } from "../routes/_authenticated/home"
import type { Post } from "../types"

interface FetchPostsResponse {
    posts: Post[]
    nextCursor: string
}

interface FetchPostsArgs {
    token: string
    activeTab: ActiveTab
    nextCursor: string
}

export const fetchFeedPosts = async ({ token, activeTab, nextCursor }: FetchPostsArgs): Promise<FetchPostsResponse> => {
    const url = `${import.meta.env.VITE_API_URL}/posts?users=${activeTab}&cursor=${nextCursor}`
    const options = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    const res = await fetch(url, options)
    if (!res.ok) throw new Error('Network response failed');
    return res.json();
}