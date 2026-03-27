export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121212] text-white">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white"
          aria-hidden
        />
        <p className="text-sm text-white/60">Loading video...</p>
      </div>
    </div>
  );
}
