import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '../../context/auth'
import type { ValidationError } from '../../types'
import { MoveLeft } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/create-post')({
  component: RouteComponent,
})

function RouteComponent() {
  const [content, setContent] = useState('')
  const [errors, setErrors] = useState<ValidationError[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  const submitPostHandler = async () => {
    if (!content.trim()) return

    setIsLoading(true)
    setErrors(null)

    const url = `${import.meta.env.VITE_API_URL}/posts/`
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({ content }),
    }
    try {
      const res = await fetch(url, options)

      if (!res.ok) {
        const data = await res.json()
        setErrors(data.errors ?? [])
        return
      }

      navigate({ to: '/home' })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="sticky top-12 flex h-12 items-center justify-between border-b border-(--app-border) bg-(--app-bg)/80 px-4 backdrop-blur-md">
        <button
          type="button"
          onClick={() => navigate({ to: '/home' })}
          className="text-sm text-(--app-muted) transition-colors hover:text-(--app-text)"
        >
          <MoveLeft />
        </button>

        <p className="text-sm font-medium text-(--app-text)">Create post</p>

        <button
          type="button"
          disabled={isLoading || !content.trim()}
          onClick={submitPostHandler}
          className="text-sm font-medium text-(--app-accent) disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'Posting...' : 'Post'}
        </button>
      </div>

      <div className="mx-auto w-full max-w-md p-4">
        <textarea
          name="content"
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={280}
          rows={10}
          required
          className="w-full resize-none bg-transparent text-base leading-relaxed text-(--app-text) outline-none border border-(--app-border) placeholder:text-(--app-muted) focus:border-(--app-accent) p-2"
        />

        <div className="mt-2 flex items-center justify-between text-xs text-(--app-muted)">
          <span>{content.length}/280</span>
        </div>

        {errors &&
          <ul className="mt-4 border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500">
            {errors.map((error, id) => (
              <li key={id}>{error.message}</li>
            ))}
          </ul>
        }
      </div>
    </>
  )
}
