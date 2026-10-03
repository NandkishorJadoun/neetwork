import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, linkOptions, Outlet, useMatchRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileActionButton } from "@/features/users/components/profile-action-button";
import { userByIdQueryOptions } from "@/features/users/queries";
import { getInitials } from "@/features/users/utils";

export const Route = createFileRoute("/_authenticated/users/$userId")({
  loader: async ({ context, params: { userId } }) => {
    await context.queryClient.query(userByIdQueryOptions(userId));
  },
  component: function RouteComponent() {
    const { userId } = Route.useParams();
    const { user: currentUser } = Route.useRouteContext();
    const matchRoute = useMatchRoute();
    const { data: { user } } = useSuspenseQuery(userByIdQueryOptions(userId));
    const isOwnProfile = currentUser.id === userId;

    const tabs = linkOptions([
      { value: "posts", label: "Posts", to: "/users/$userId", params: { userId } },
      { value: "comments", label: "Comments", to: "/users/$userId/comments", params: { userId } },
      { value: "likes", label: "Likes", to: "/users/$userId/likes", params: { userId } },
    ]);

    const followLinks = linkOptions([
      { label: "Followers", to: "/users/$userId/followers", params: { userId } },
      { label: "Following", to: "/users/$userId/followings", params: { userId } },
    ]);

    const activeTab
      = tabs.find(tab => matchRoute({ to: tab.to, params: tab.params }))?.value ?? "posts";

    return (
      <>
        <section>
          <PageHeader>
            <p className="text-center">User Profile</p>
          </PageHeader>
          <div className="p-4 pb-0">
            <Avatar className="size-20">
              <AvatarImage src={user.image ?? undefined} alt={`${user.name}'s avatar`} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>

            <div className="mt-3">
              <h1 className="text-xl font-bold text-foreground">
                {user.name}
              </h1>

              <p className="text-sm text-muted-foreground">
                @
                {user.name}
              </p>
            </div>

            {user.about && (
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {user.about}
              </p>
            )}

            <div className="mt-4 flex gap-4 text-sm">
              {followLinks.map(({ label, ...link }) => (
                <Link
                  key={label}
                  {...link}
                  params={{ userId: user.id }}
                  className="flex items-center gap-1.5"
                >
                  <Badge variant="secondary">
                    {label === "Followers"
                      ? user._count.followers
                      : user._count.followings}
                  </Badge>
                  <span className="text-muted-foreground">{label}</span>
                </Link>
              ))}
            </div>

            <div className="mt-4">
              <ProfileActionButton
                profileUserId={user.id}
                followers={user.followers}
                isOwnProfile={isOwnProfile}
              />
            </div>
          </div>
        </section>

        <section>
          <div className="sticky top-0 z-10 mt-4 border-b border-border bg-background/80 backdrop-blur-md">
            <Tabs value={activeTab}>
              <TabsList variant="line" className="mx-auto flex max-w-md justify-center gap-6 px-4">
                {tabs.map(({ value, label, ...linkProps }) => (
                  <TabsTrigger
                    key={value}
                    nativeButton={false}
                    value={value}
                    render={<Link {...linkProps} />}
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="px-0">
            <Outlet />
          </div>
        </section>
      </>
    );
  },
});
