import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '../../context/auth'
import type { ValidationError } from '../../types'
import { PageHeader } from '../../components/PageHeader'

export const Route = createFileRoute('/_authenticated/create-post')({
  component: RouteComponent,
})

function RouteComponent() {
  const [content, setContent] = useState('')
  const [errors, setErrors] = useState<ValidationError[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  const submitPostHandler = async (e: React.SubmitEvent) => {
    e.preventDefault()
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
      <PageHeader>Create post</PageHeader>
      <form className="p-4" onSubmit={submitPostHandler}>
        <textarea
          name="content"
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={280}
          rows={10}
          required
          className="w-full resize-none text-base text-(--app-text) outline-none border border-(--app-border) placeholder:text-(--app-muted) focus:border-(--app-accent) px-3 py-2 rounded-md"
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-(--app-muted)">
            {content.length}/280
          </span>

          <button
            disabled={content.trim().length === 0 || isLoading}
            type="submit"
            className="
                rounded-md border border-(--app-border)
                px-4 py-2 text-sm font-medium
                text-(--app-text)
                transition-colors
                hover:bg-(--app-surface)
                disabled:cursor-not-allowed
                disabled:opacity-50
                "
          >
            {isLoading ? 'Posting...' : 'Post'}
          </button>
        </div >

        {errors &&
          <ul className="mt-4 border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500">
            {errors.map((error, id) => (
              <li key={id}>{error.message}</li>
            ))}
          </ul>
        }
      </form>
    </>
  )
}
