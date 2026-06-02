import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
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
  const { user, token }: { user: User, token: string } = Route.useLoaderData()

  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({ fullname: user.fullname, about: user.about || "" })
  const [errors, setErrors] = useState<ValidationError[] | null>(null)

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
    }
  }

  return (
    <>
      <header>Edit Profile</header>
      <form onSubmit={formSubmitHandler}>
        <div>
          <div>
            <img src={preview ?? user.avatar} alt={`${user.fullname}' avatar`} />
          </div>
          <label htmlFor="avatar">Upload</label>
          <input type="file" name="avatar" id="avatar" accept="image/*" className="opacity-0 size-0" onChange={handleFileChange} />

          <FormErrors fieldName="avatar" errors={errors} />

        </div>
        <div>
          <label htmlFor="fullname">Full Name</label>
          <input type="text" name="fullname" id="fullname" required value={formData.fullname}
            onChange={(e) => setFormData({ ...formData, fullname: e.target.value })} />
          <FormErrors fieldName="fullname" errors={errors} />
        </div>
        <div>
          <label htmlFor="about">About</label>
          <textarea name="about" id="about" value={formData.about}
            onChange={(e) => setFormData({ ...formData, about: e.target.value })} />
          <FormErrors fieldName="about" errors={errors} />
        </div>
        <div>
          <button type='button'>Cancel</button>
          <button type='submit'>Update</button>
        </div>
      </form>
    </>
  )
}
