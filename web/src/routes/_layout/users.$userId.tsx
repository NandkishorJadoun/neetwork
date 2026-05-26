import { createFileRoute, Link } from '@tanstack/react-router'
import type { User, Post, Comment } from '../../types'
import { useAuth } from '../../auth'

type Tab = "posts" | "comments"

type SearchParams = {
  tab?: "comments"
}

type LoaderData = {
  user: User,
  tab: Tab
  tabData: Post[] | Comment[]
}

function getTab(search: SearchParams): Tab {
  return search.tab ? "comments" : "posts"
}

export const Route = createFileRoute('/_layout/users/$userId')({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      tab: search.tab === 'comments' ? 'comments' : undefined,
    }
  },
  loaderDeps: ({ search }) => ({ tab: getTab(search) }),
  loader: async ({ context, params: { userId }, deps: { tab } }) => {
    const token = context.auth.user?.token
    const options = { headers: { Authorization: `Bearer ${token}` } }
    const baseUrl = `${import.meta.env.VITE_API_URL}/users/${userId}`
    const tabUrl = `${baseUrl}/${tab}`

    const [userRes, tabRes] = await Promise.all([fetch(baseUrl, options), fetch(tabUrl, options)])

    if (!userRes.ok) {
      throw new Error("Failed to load user")
    }

    if (!tabRes.ok) {
      throw new Error("Failed to load tab data")
    }

    const { user } = await userRes.json();
    const tabData = await tabRes.json();

    return { user, tab, tabData };
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { user, tab, tabData }: LoaderData = Route.useLoaderData()
  return (
    <main>
      <div className="border">
        <img src={user.avatar} alt={user.fullname} />
        <p>{user.fullname}</p>
        <p>{user.username}</p>
        <p>{user.about}</p>
        <div>
          <Link to="/users/$userId/followers" params={{ userId: user.id }}>Followers: {user._count.followers}</Link>
          <Link to="/users/$userId/followings" params={{ userId: user.id }}>Followings: {user._count.followings}</Link>
        </div>

        <ActionButtons user={user} />
      </div>

      <div>
        <Link to="/users/$userId" params={{ userId: user.id }}>Posts</Link>
        <Link to="/users/$userId"
          params={{ userId: user.id }}
          search={{ tab: "comments" }}>Comments</Link>
      </div>

      <div>
        {JSON.stringify(tabData)}
      </div>
    </main >
  )
}

export const ActionButtons = ({ user }: { user: User }) => {
  const { user: currentUser } = useAuth()
  const { followers } = user;

  if (currentUser && currentUser.id === user.id) {
    return <Link to='/edit-profile'>Edit Profile</Link>
  }

  if (followers.length === 0) {
    return <button>Follow</button>
  }

  const isFollowing = followers[0].status === "ACCEPTED";

  return <button>{isFollowing ? "Following" : "Requested"}</button>
}