import { Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '../context/auth'
import type { User } from '../types'

export const ActionButton = ({ user }: { user: User }) => {
  const { user: currentUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const baseClass =
    'inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'

  const sendFollowRequest = async () => {
    setIsLoading(true)

    const url = `${import.meta.env.VITE_API_URL}/users/${user.id}/follow-request`
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentUser?.token}`,
      },
    }

    try {
      await fetch(url, options)
      router.invalidate()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const unfollowHandler = async (isFollowing: boolean) => {
    setIsLoading(true)

    const url = `${import.meta.env.VITE_API_URL}/users/${user.id}/${isFollowing ? 'follow' : 'follow-request'}`
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentUser?.token}`,
      },
    }

    try {
      await fetch(url, options)
      router.invalidate()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (currentUser && currentUser.id === user.id) {
    return (
      <Link
        to="/edit-profile"
        className={`${baseClass} border-(--app-border) bg-transparent text-(--app-text) hover:bg-(--app-surface)`}
      >
        Edit profile
      </Link>
    )
  }

  if (user.followers.length === 0) {
    return (
      <button
        disabled={isLoading}
        onClick={sendFollowRequest}
        className={`${baseClass} border-(--app-border) bg-transparent text-(--app-text) hover:bg-(--app-surface)`}
      >
        {isLoading ? 'Following...' : 'Follow'}
      </button>
    )
  }

  const isFollowing = user.followers[0].status === 'ACCEPTED'

  return (
    <button
      disabled={isLoading}
      onClick={() => unfollowHandler(isFollowing)}
      className={`${baseClass} ${
        isFollowing
          ? 'border-(--app-border) bg-(--app-surface) text-(--app-text)'
          : 'border-(--app-border) bg-transparent text-(--app-text) hover:bg-(--app-surface)'
      }`}
    >
      {isLoading ? 'Updating...' : isFollowing ? 'Following' : 'Requested'}
    </button>
  )
}