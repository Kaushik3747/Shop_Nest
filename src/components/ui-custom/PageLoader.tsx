export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-brand-100 dark:border-brand-900"></div>
          <div className="w-16 h-16 rounded-full border-4 border-brand-500 border-t-transparent animate-spin absolute inset-0"></div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold text-foreground">Shop</span>
          <span className="font-display text-2xl font-bold text-brand-500">Nest</span>
        </div>
        <p className="text-muted-foreground text-sm animate-pulse">Loading your experience...</p>
      </div>
    </div>
  );
}
