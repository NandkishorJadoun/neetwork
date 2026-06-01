import type { Tab, TabData } from "../routes/_authenticated/users.$userId"
import type { Like, Post, Comment } from "../types"

type ProfileTabContent = {
    tab: Tab,
    tabData: TabData
}

export const ProfileTabContent = ({ tab, tabData }: ProfileTabContent) => {
    if ("posts" in tabData) {
        const { posts } = tabData
        return <ProfilePostList posts={posts} />
    } else if ("comments" in tabData) {
        const { comments } = tabData
        return <ProfileCommentList comments={comments} />
    }

    const { likes } = tabData
    return <ProfileLikedPostList likes={likes} />

}

const ProfilePostList = ({ posts }: { posts: Post[] }) => {
    return <>
        <div>Posts</div>
        <div>{"There will be Posts"}</div>
    </>
}


const ProfileCommentList = ({ comments }: { comments: Comment[] }) => {
    return <>
        <div>Comments</div>
        <div>{"There will be Comments"}</div>
    </>
}

const ProfileLikedPostList = ({ likes }: { likes: Like[] }) => {
    return <>
        <div>Likes</div>
        <div>{"There will be Liked Posts"}</div>
    </>
}