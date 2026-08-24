import type { TabData } from "../routes/_authenticated/users.$userId"
import type { Like, Post, Comment } from "../types"
import { CommentCard } from "./CommentCard"
import { PostCard } from "./PostCard"

type ProfileTabContent = {
  tabData: TabData
}

export const ProfileTabContent = ({ tabData }: ProfileTabContent) => {

  if ("posts" in tabData) {
    const { posts } = tabData
    return <ProfilePostList posts={posts} />

  } else if ("comments" in tabData) {
    const { comments } = tabData
    return <ProfileCommentList comments={comments} />

  } else {
    const { likes } = tabData
    return <ProfileLikedPostList likes={likes} />

  }
}

const ProfilePostList = ({ posts }: { posts: Post[] }) => {
  return (
    <div>
      {
        posts.map(post => {
          return <PostCard key={post.id} post={post} />
        })
      }
    </div>
  )
}


const ProfileCommentList = ({ comments }: { comments: Comment[] }) => {
  return (
    <div>
      {
        comments.map(comment => {
          const { id, text, author, post } = comment;
          return (
            <div key={id}>
              <PostCard post={post} comment={<CommentCard author={author} text={text} />} />
            </div>
          )
        })
      }
    </div>
  )
}

const ProfileLikedPostList = ({ likes }: { likes: Like[] }) => {
  return (
    <div>
      {
        likes.map(like => {
          const { id, post } = like
          return <PostCard key={id} post={post} />
        })
      }
    </div>
  )
}