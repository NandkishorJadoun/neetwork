import { createFileRoute, Link } from '@tanstack/react-router'
import type { User, Post, Comment, Like } from '../../types'
import { ActionButton } from '../../components/ProfileActionButton'
import { ProfileTabContent } from '../../components/ProfileTabContent'
import { PageHeader } from '../../components/PageHeader'

type Tab = 'posts' | 'comments' | 'likes'
export type TabData = { posts: Post[] } | { comments: Comment[] } | { likes: Like[] }

type SearchParams = {
  tab?: 'comments' | 'likes'
}

type LoaderData = {
  user: User
  tabData: TabData
}

function getTab(search: SearchParams): Tab {
  if (!search.tab) return 'posts'
  return search.tab
}

export const Route = createFileRoute('/_authenticated/users/$userId')({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      tab:
        search.tab === 'comments' || search.tab === 'likes'
          ? search.tab
          : undefined,
    }
  },
  loaderDeps: ({ search }) => ({ tab: getTab(search) }),
  loader: async ({ context, params: { userId }, deps: { tab } }) => {
    const token = context.auth.user?.token
    const options = { headers: { Authorization: `Bearer ${token}` } }
    const baseUrl = `${import.meta.env.VITE_API_URL}/users/${userId}`
    const tabUrl = `${baseUrl}/${tab}`

    const [userRes, tabRes] = await Promise.all([
      fetch(baseUrl, options),
      fetch(tabUrl, options),
    ])

    if (!userRes.ok) throw new Error('Failed to load user')
    if (!tabRes.ok) throw new Error('Failed to load tab data')

    const { user } = await userRes.json()
    const tabData = await tabRes.json()

    return { user, tabData }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { user, tabData }: LoaderData = Route.useLoaderData()
  const activeTab = Route.useSearch().tab

  const tabBase =
    'px-4 py-3 text-sm font-medium text-(--app-muted) transition-colors'
  const tabActive = 'text-(--app-text) border-b-2 border-(--app-accent)'

  return (
    <>
      <section>
        <PageHeader>
          <p className='text-center'>User Profile</p>
        </PageHeader>
        <div className='p-4 pb-0'>
          <img
            src={user.avatar}
            alt={`${user.username}'s avatar`}
            className="h-20 w-20 rounded-full object-cover"
          />

          <div className="mt-3">
            <h1 className="text-xl font-bold">
              {user.fullname}
            </h1>

            <p className="text-sm text-(--app-muted)">
              @{user.username}
            </p>
          </div>

          {user.about && (
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">
              {user.about}
            </p>
          )}

          <div className="mt-4 flex gap-4 text-sm">
            <Link
              to="/users/$userId/followers"
              params={{ userId: user.id }}
            >
              <span className="font-semibold">
                {user._count.followers}
              </span>{' '}
              <span className="text-(--app-muted)">
                Followers
              </span>
            </Link>

            <Link
              to="/users/$userId/followings"
              params={{ userId: user.id }}
            >
              <span className="font-semibold">
                {user._count.followings}
              </span>{' '}
              <span className="text-(--app-muted)">
                Following
              </span>
            </Link>
          </div>

          <div className="mt-4">
            <ActionButton user={user} />
          </div>
        </div>
      </section>

      <section>
        <div className="sticky top-0 z-10 mt-4 border-b border-(--app-border) bg-(--app-bg)/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-md justify-center gap-6 px-4">
            <Link
              to="/users/$userId"
              params={{ userId: user.id }}
              className={`${tabBase} ${!activeTab ? tabActive : ''}`}
            >
              Posts
            </Link>

            <Link
              to="/users/$userId"
              params={{ userId: user.id }}
              search={{ tab: 'comments' }}
              className={`${tabBase} ${activeTab === 'comments' ? tabActive : ''}`}
            >
              Comments
            </Link>

            <Link
              to="/users/$userId"
              params={{ userId: user.id }}
              search={{ tab: 'likes' }}
              className={`${tabBase} ${activeTab === 'likes' ? tabActive : ''}`}
            >
              Likes
            </Link>
          </div>
        </div>

        <div className="px-0">
          <ProfileTabContent tabData={tabData} />
        </div>
      </section>
    </>
  )
}