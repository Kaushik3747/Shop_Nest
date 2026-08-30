export default function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border animate-pulse">
      <div className="aspect-square bg-muted"></div>
      <div className="p-4 space-y-3">
        <div className="h-3 bg-muted rounded w-1/3"></div>
        <div className="h-4 bg-muted rounded w-4/5"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-6 bg-muted rounded w-1/4"></div>
        </div>
        <div className="h-10 bg-muted rounded-xl"></div>
      </div>
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border animate-pulse flex gap-4 p-4">
      <div className="w-32 h-32 bg-muted rounded-xl flex-shrink-0"></div>
      <div className="flex-1 space-y-3 py-1">
        <div className="h-3 bg-muted rounded w-1/4"></div>
        <div className="h-5 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-4 bg-muted rounded w-1/3"></div>
        <div className="flex gap-3">
          <div className="h-9 bg-muted rounded-xl w-28"></div>
          <div className="h-9 bg-muted rounded-xl w-28"></div>
        </div>
      </div>
    </div>
  );
}
