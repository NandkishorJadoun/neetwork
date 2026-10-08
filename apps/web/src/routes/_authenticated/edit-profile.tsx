import { toValidationMessage, UpdateProfileInputSchema } from "@neetwork/contracts";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldError as FieldErrorMessage, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { getInitials } from "@/features/users/utils";
import { PageHeader } from "../../components/page-header";
import { fetchAvatarSignature, uploadAvatarToCloudinary } from "../../features/users/api";
import { useUpdateProfile } from "../../features/users/mutations";
import { accountMeQueryOptions } from "../../features/users/queries";

const ACCEPTED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_AVATAR_BYTES = 3 * 1024 * 1024;

export const Route = createFileRoute("/_authenticated/edit-profile")({
  loader: ({ context }) => {
    context.queryClient.query(accountMeQueryOptions());
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const router = useRouter();
  const { data: { user } } = useSuspenseQuery(accountMeQueryOptions());

  const [formUserId, setFormUserId] = useState(user.id);
  const [formData, setFormData] = useState({
    fullname: user.name,
    about: user.about ?? "",
  });

  if (formUserId !== user.id) {
    setFormUserId(user.id);
    setFormData({
      fullname: user.name,
      about: user.about ?? "",
    });
  }
  const [error, setError] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<string | null | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<"idle" | "signing" | "uploading" | "error">("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isUploading = uploadState === "signing" || uploadState === "uploading";

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const { mutate, isPending } = useUpdateProfile();

  const avatarSrc = pendingImage ?? previewUrl ?? user.image ?? undefined;

  const fileSelectHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) {
      return;
    }

    if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
      setUploadState("error");
      setUploadError("Avatar must be a JPEG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      setUploadState("error");
      setUploadError("Avatar must be 3MB or smaller.");
      return;
    }

    setUploadError(null);
    setUploadState("signing");

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return objectUrl;
    });

    try {
      const signature = await fetchAvatarSignature();
      setUploadState("uploading");
      const { secureUrl } = await uploadAvatarToCloudinary(file, signature);
      setPendingImage(secureUrl);
      setUploadState("idle");
    }
    catch (err) {
      setUploadState("error");
      setUploadError(err instanceof Error ? err.message : "Avatar upload failed");
    }
  };

  const removeAvatarHandler = () => {
    setPreviewUrl((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
    setPendingImage(null);
    setUploadState("idle");
    setUploadError(null);
  };

  const formSubmitHandler = (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = UpdateProfileInputSchema.safeParse(
      pendingImage === undefined ? formData : { ...formData, image: pendingImage },
    );

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
            <Avatar className="size-20">
              <AvatarImage src={avatarSrc} alt={`${user.name}'s avatar`} />
              <AvatarFallback>{getInitials(formData.fullname.trim() || user.name)}</AvatarFallback>
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={fileSelectHandler}
              disabled={isUploading}
            />
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploading}
                onClick={() => {
                  fileInputRef.current?.click();
                }}
              >
                {isUploading ? <Spinner /> : null}
                {isUploading ? "Uploading..." : "Change avatar"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isUploading}
                onClick={removeAvatarHandler}
              >
                Remove
              </Button>
            </div>
            {uploadError && (
              <Field>
                <FieldErrorMessage>{uploadError}</FieldErrorMessage>
              </Field>
            )}
          </div>

          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="fullname">
              Full Name
              <span className="text-red-500"> *</span>
            </FieldLabel>
            <Input
              type="text"
              name="fullname"
              id="fullname"
              required
              value={formData.fullname}
              disabled={isPending}
              aria-invalid={Boolean(error)}
              onChange={(e) => {
                setFormData({ ...formData, fullname: e.target.value });
              }}
            />
          </Field>

          <Field data-invalid={Boolean(error)}>
            <FieldLabel htmlFor="about">About</FieldLabel>
            <Textarea
              name="about"
              id="about"
              rows={4}
              value={formData.about}
              disabled={isPending}
              maxLength={100}
              aria-invalid={Boolean(error)}
              onChange={(e) => {
                setFormData({ ...formData, about: e.target.value });
              }}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {formData.about.length}
                /100
              </span>
            </div>
          </Field>

          {error && (
            <Field>
              <FieldErrorMessage>{error}</FieldErrorMessage>
            </Field>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                router.history.back();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isPending || isUploading}
            >
              {isPending ? <Spinner /> : null}
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
