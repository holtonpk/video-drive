export default function Loading() {
  return (
    <div className="min-h-screen bg-[#121212] px-6 pt-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 h-8 w-64 animate-pulse rounded bg-white/10" />

        <div className="grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-4">
          {Array.from({length: 8}).map((_, i) => (
            <div
              key={i}
              className="h-[200px] w-[356px] md:h-36 md:w-[256px] animate-pulse rounded bg-white/10"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
