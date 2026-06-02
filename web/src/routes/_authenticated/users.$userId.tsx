import { createFileRoute, Link } from '@tanstack/react-router'
import type { User, Post, Comment, Like } from '../../types'
import { ActionButton } from '../../components/ProfileActionButton'
import { ProfileTabContent } from '../../components/ProfileTabContent';

type Tab = "posts" | "comments" | "likes";
export type TabData = { posts: Post[] } | { comments: Comment[] } | { likes: Like[] };

type SearchParams = {
  tab?: "comments" | "likes"
}

type LoaderData = {
  user: User,
  tabData: TabData;
}

function getTab(search: SearchParams): Tab {
  if (!search.tab) {
    return "posts"
  }

  return search.tab
}

export const Route = createFileRoute('/_authenticated/users/$userId')({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      tab:
        search.tab === "comments" || search.tab === "likes"
          ? search.tab
          : undefined
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

    return { user, tabData };
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { user, tabData }: LoaderData = Route.useLoaderData();

  return (
    <main>
      <div className="border">
        <img src={user.avatar} alt={`${user.username}'s avatar`} />
        <p>{user.fullname}</p>
        <p>{user.username}</p>
        <p>{user.about}</p>
        <div>
          <Link to="/users/$userId/followers" params={{ userId: user.id }}>Followers: {user._count.followers}</Link>
          <Link to="/users/$userId/followings" params={{ userId: user.id }}>Followings: {user._count.followings}</Link>
        </div>

        <ActionButton user={user} />
      </div>

      <div>
        <Link to="/users/$userId" params={{ userId: user.id }}>Posts</Link>
        <Link to="/users/$userId"
          params={{ userId: user.id }}
          search={{ tab: "comments" }}>Comments
        </Link>
        <Link to="/users/$userId"
          params={{ userId: user.id }}
          search={{ tab: "likes" }}>Likes
        </Link>
      </div>

      <ProfileTabContent tabData={tabData} />
    </main >
  )
}