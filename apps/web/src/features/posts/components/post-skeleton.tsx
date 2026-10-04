import { Skeleton } from "@/components/ui/skeleton";

export const PostCardSkeleton = ({ hasComment = false, ref }: { hasComment?: boolean; ref?: React.Ref<HTMLInputElement> }) => {
  return (
    <div ref={ref} className="border-b border-border px-4 py-3">
      <div className="flex gap-3">
        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>

          <div className="mt-2 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-3 w-4" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-3 w-4" />
            </div>
          </div>
        </div>
      </div>

      {hasComment && (
        <div className="mt-1 flex gap-3 items-start">
          <div className="w-10 h-10 shrink-0 flex justify-end relative">
            <div className="w-1/2 h-[150%] absolute -top-7.5 right-0 border-l-2 border-b-2 border-border rounded-bl-xl" />
          </div>
          <div className="min-w-0 flex-1 text-xs rounded-xl px-2.5 mt-2">
            <Skeleton className="h-3 w-5/6" />
          </div>
        </div>
      )}
    </div>
  );
};
