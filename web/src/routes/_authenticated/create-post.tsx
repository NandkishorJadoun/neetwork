import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '../../auth'
import type { ValidationError } from '../../types'

export const Route = createFileRoute('/_authenticated/create-post')({
  component: RouteComponent,
})

function RouteComponent() {
  const [content, setContent] = useState("")
  const [errors, setErrors] = useState<ValidationError[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth();

  const submitPostHandler = async () => {
    setIsLoading(true)
    const url = `${import.meta.env.VITE_API_URL}/posts/`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user?.token}`
      },
      body: JSON.stringify({ content }),
    }
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        const { errors } = await res.json()
        setErrors(errors)
        setIsLoading(false)
        return;
      }
      return navigate({ to: "/home" })
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <header>
        <button>Back</button>
        <p>Create Post</p>
        <button disabled={isLoading}
          onClick={submitPostHandler}
        >{isLoading ? "Posting" : "Post"}</button>
      </header>
      <main>
        <textarea
          name="content"
          placeholder="What's happening?"
          value={content}
          onChange={(e => setContent(e.target.value))}
          maxLength={280} rows={10} required />
        {errors && <ul>
          {errors.map((error, id) => {
            return <li key={id}>{error.message}</li>
          })}
        </ul>}
      </main>
    </>
  )
}
