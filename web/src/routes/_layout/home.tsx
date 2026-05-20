import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/home')({
  component: RouteComponent,
})

function RouteComponent() {

  return <>
    <header className='bg-amber-700'>Header</header>
    <div>posts type:</div>
    <div>
      <Link to='/home'>All</Link>
      <Link to='/home/following'>Following</Link>
    </div>
    <Outlet />
  </>
}
