import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { MoveLeft } from 'lucide-react'
import type { User, ValidationError } from '../../types'
import { FormErrors } from '../../components/FormErrors'

export const Route = createFileRoute('/_authenticated/edit-profile')({
  loader: async ({ context }) => {
    const token = context.auth.user?.token
    const options = { headers: { Authorization: `Bearer ${token}` } }
    const url = `${import.meta.env.VITE_API_URL}/me`
    const res = await fetch(url, options)

    if (!res.ok) {
      throw new Error("Failed to load user's info")
    }

    const { user } = await res.json();
    return { user, token }
  },
  component: RouteComponent,
})

function RouteComponent() {

  const navigate = useNavigate();
  const router = useRouter();
  const { user, token }: { user: User, token: string } = Route.useLoaderData()

  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({ fullname: user.fullname, about: user.about || "" })
  const [errors, setErrors] = useState<ValidationError[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null)
      setAvatar(null)
      return
    }
    setAvatar(file)
    setPreview(URL.createObjectURL(file));
  };

  const formSubmitHandler = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true)
    setErrors(null)
    const url = `${import.meta.env.VITE_API_URL}/me`
    const formBody = new FormData()

    formBody.append("fullname", formData.fullname)
    formBody.append("about", formData.about)
    if (avatar) {
      formBody.append("avatar", avatar)
    }

    const options = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formBody
    }

    try {
      const res = await fetch(url, options)

      if (!res.ok) {
        const { errors } = await res.json()
        setErrors(errors)
        return
      }

      navigate({ to: "/users/$userId", params: { userId: user.id } })

    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-6rem)]">
      <div className="sticky top-12 z-10 flex h-12 items-center justify-between border-b border-(--app-border) bg-(--app-bg)/80 px-4 backdrop-blur-md">
        <button
          type="button"
          onClick={() => navigate({ to: '/users/$userId', params: { userId: user.id } })}
          className="text-sm text-(--app-muted) transition-colors hover:text-(--app-text)"
        >
          <MoveLeft />
        </button>

        <p className="text-sm font-medium text-(--app-text)">Edit Profile</p>

        <div className="w-5" />
      </div>

      <div className="mx-auto w-full max-w-md p-4">
        <form onSubmit={formSubmitHandler} className="space-y-6">
          <div className="flex flex-col items-center gap-3">
            <img
              src={preview ?? user.avatar}
              alt={`${user.fullname}'s avatar`}
              className="h-20 w-20 rounded-full object-cover"
            />

            <label
              htmlFor="avatar"
              className="inline-block cursor-pointer border border-(--app-border) px-4 py-2 text-sm font-medium text-(--app-text) transition-colors hover:bg-(--app-surface)"
            >
              Upload photo
            </label>
            <input
              type="file"
              name="avatar"
              id="avatar"
              accept="image/*"
              className="opacity-0 size-0"
              onChange={handleFileChange}
            />

            <FormErrors fieldName="avatar" errors={errors} />
          </div>

          <div className="space-y-1">
            <label htmlFor="fullname" className="block text-sm font-medium text-(--app-text)">
              Full Name
              <span className='text-red-500'> *</span>
            </label>
            <input
              type="text"
              name="fullname"
              id="fullname"
              required
              value={formData.fullname}
              onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
              className="w-full border border-(--app-border) bg-transparent px-3 py-2 text-sm text-(--app-text) outline-none placeholder:text-(--app-muted) focus:border-(--app-accent)"
            />
            <FormErrors fieldName="fullname" errors={errors} />
          </div>

          <div className="space-y-1">
            <label htmlFor="about" className="block text-sm font-medium text-(--app-text)">
              About
            </label>
            <textarea
              name="about"
              id="about"
              rows={4}
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              className="w-full resize-none border border-(--app-border) bg-transparent px-3 py-2 text-sm text-(--app-text) outline-none placeholder:text-(--app-muted) focus:border-(--app-accent)"
            />
            <FormErrors fieldName="about" errors={errors} />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.history.back()}
              className="flex-1 border border-(--app-border) px-4 py-2 text-sm font-medium text-(--app-text) transition-colors hover:bg-(--app-surface)"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 border border-(--app-accent) bg-(--app-accent) px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
