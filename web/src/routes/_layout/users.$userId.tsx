import { createFileRoute, Link } from '@tanstack/react-router'
import type { User, Post, Comment } from '../../types'

type Tab = {
  tab?: 'comments'
}
type LoaderData = {
  user: User,
  tabData: Post[] | Comment[],
}

export const Route = createFileRoute('/_layout/users/$userId')({
  validateSearch: (search: Record<string, unknown>): Tab => {
    return {
      tab: search.tab === 'comments' ? 'comments' : undefined,
    }
  },
  loaderDeps: ({ search }) => ({ tab: search.tab }),
  loader: async ({ context, params: { userId }, deps: { tab } }) => {
    const token = context.auth.user?.token
    const baseUrl = `${import.meta.env.VITE_API_URL}/users/${userId}`
    const headers = { Authorization: `Bearer ${token}` }

    const [userRes, tabRes] = await Promise.all([
      fetch(baseUrl, { headers }),
      fetch(`${baseUrl}/${tab ? 'comments' : "posts"}`, { headers }),
    ])



    const [{ user }, tabResData] = await Promise.all([userRes.json(), tabRes.json()])

    return { user, tabData, }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { user, tabData }: LoaderData = Route.useLoaderData()

  return (
    <main>
      <div className="border">
        <img src={user.avatar} alt={user.fullname} />
        <p>{user.fullname}</p>
        <p>{user.username}</p>
        <p>{user.about}</p>
      </div>

      <div>
        <Link to="/users/$userId" params={{ userId: user.id }}>Posts</Link>
        <Link to="/users/$userId" params={{ userId: user.id }} search={{ tab: "comments" }}>Comments</Link>
      </div>

      <div>
        {JSON.stringify(tabData)}
      </div>
    </main >
  )
}