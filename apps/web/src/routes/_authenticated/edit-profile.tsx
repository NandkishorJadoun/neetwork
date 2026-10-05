import { toValidationMessage, UpdateProfileInputSchema } from "@neetwork/contracts";
import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import { Field, FieldError } from "@/components/ui/field";
import { PageHeader } from "../../components/page-header";
import { fetchUserProfile } from "../../features/users/api";
import { useUpdateProfile } from "../../features/users/mutations";

export const Route = createFileRoute("/_authenticated/edit-profile")({
  loader: async ({ context }) => {
    const { user } = await context.queryClient.fetchQuery({
      queryKey: ["account", "me"],
      queryFn: ({ signal }) => fetchUserProfile({ signal }),
    });

    return { user };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const router = useRouter();
  const { user } = Route.useLoaderData();

  const [formData, setFormData] = useState({
    fullname: user.name,
    about: user.about ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending } = useUpdateProfile();

  const formSubmitHandler = (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = UpdateProfileInputSchema.safeParse(formData);

    if (!parsed.success) {
      setError(toValidationMessage(parsed.error.issues));
      return;
    }

    mutate(parsed.data, {
      onSuccess: ({ user: updated }) => {
        navigate({ to: "/users/$userId", params: { userId: updated.id } });
      },
      onError: (error) => {
        setError(error.message);
      },
    });
  };

  return (
    <>
      <PageHeader>Edit profile</PageHeader>
      <div className="md:w-md mx-auto w-full p-4">
        <form onSubmit={formSubmitHandler} className="space-y-6">
          <div className="flex flex-col items-center gap-3">
            <img
              src={user.image ?? "/default-avatar.png"}
              alt={`${user.name}'s avatar`}
              className="h-20 w-20 rounded-full object-cover"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="fullname"
              className="block text-sm font-medium text-(--app-text)"
            >
              Full Name
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              name="fullname"
              id="fullname"
              required
              value={formData.fullname}
              onChange={(e) => {
                setFormData({ ...formData, fullname: e.target.value });
              }}
              className="rounded-md w-full border border-(--app-border) bg-transparent px-3 py-2 text-sm text-(--app-text) outline-none placeholder:text-(--app-muted) focus:border-(--app-accent)"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="about"
              className="block text-sm font-medium text-(--app-text)"
            >
              About
            </label>
            <textarea
              name="about"
              id="about"
              rows={4}
              value={formData.about}
              onChange={(e) => {
                setFormData({ ...formData, about: e.target.value });
              }}
              className="w-full rounded-md resize-none border border-(--app-border) bg-transparent px-3 py-2 text-sm text-(--app-text) outline-none placeholder:text-(--app-muted) focus:border-(--app-accent)"
            />
          </div>

          {error && (
            <Field>
              <FieldError>{error}</FieldError>
            </Field>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                router.history.back();
              }}
              className="flex-1 rounded-md border border-(--app-border) px-4 py-2 text-sm font-medium text-(--app-text) transition-colors hover:bg-(--app-surface)"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 border border-(--app-accent) bg-(--app-accent) px-4 py-2 text-sm font-medium text-white rounded-md transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
