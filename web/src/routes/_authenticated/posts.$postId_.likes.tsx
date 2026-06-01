import { createFileRoute, Link } from '@tanstack/react-router'
import type { Like } from '../../types'

export const Route = createFileRoute('/_authenticated/posts/$postId_/likes')({
  loader: async ({ context, params: { postId } }) => {
    const token = context.auth.user?.token
    const options = { headers: { Authorization: `Bearer ${token}` } }
    const Url = `${import.meta.env.VITE_API_URL}/posts/${postId}/likes`

    const res = await fetch(Url, options)

    if (!res.ok) {
      throw new Error("Failed to load post's likes")
    }

    return await res.json();
  },
  component: RouteComponent
})

function RouteComponent() {
  const { likes }: { likes: Like[] } = Route.useLoaderData();

  return <>
    <header>
      <button>Back</button>
      <p>Total Likes: {likes.length}</p>
    </header>
    <main>
      {likes.map(like => {
        return <LikeUserCard key={like.id} like={like} />
      })}
    </main>
  </>
}

const LikeUserCard = ({ like }: { like: Like }) => {
  const { user } = like;

  return (
    <Link className='border block' to='/users/$userId' params={{ userId: user.id }}>
      <img src={user.avatar} alt="" width={25} />
      <div>
        <p>{user.fullname}</p>
        <p>{user.username}</p>
      </div>
    </Link>
  )
}