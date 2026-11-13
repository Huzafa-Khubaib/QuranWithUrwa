import { Skeleton } from "@/components/ui/skeleton";
import { ClayCard } from "@/components/shared/clay-card";

export function PortalLoading({ cards = 4 }: { cards?: number }) {
  return (
    <div className="space-y-4 sm:space-y-5" aria-busy aria-label="Loading">
      <ClayCard color="white" className="space-y-3 p-5 sm:p-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-2/3 max-w-xs" />
        <Skeleton className="h-4 w-full max-w-md" />
      </ClayCard>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: cards }).map((_, i) => (
          <ClayCard key={i} color="cream" className="space-y-3 p-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-3 w-24" />
          </ClayCard>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ClayCard color="white" className="space-y-3 p-5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-24 w-full" />
        </ClayCard>
        <ClayCard color="white" className="space-y-3 p-5">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-24 w-full" />
        </ClayCard>
      </div>
    </div>
  );
}

export function MarketingLoading() {
  return (
    <div className="space-y-6 px-3 pt-6 sm:px-4 sm:pt-8" aria-busy>
      <Skeleton className="mx-auto h-48 w-full max-w-6xl rounded-[2rem] sm:h-56" />
      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

export function AuthLoading() {
  return (
    <div className="flex flex-1 items-center justify-center p-4" aria-busy>
      <div className="w-full max-w-md space-y-4">
        <Skeleton className="mx-auto h-12 w-12 rounded-2xl" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </div>
  );
}
