import {NavBar} from "../../../navbar";
import {Footer} from "../../../footer";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-[#121212] text-white">
      <NavBar />

      <main className="flex flex-1 flex-col px-6 pt-24 pb-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-8 h-10 w-64 animate-pulse rounded bg-white/10" />
          <div className="mb-4 h-6 w-96 animate-pulse rounded bg-white/10" />
          <div className="mb-10 h-4 w-full max-w-3xl animate-pulse rounded bg-white/5" />

          <div className="grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-4 place-items-center">
            {Array.from({length: 8}).map((_, i) => (
              <div
                key={i}
                className="h-[200px] w-[356px] md:h-36 md:w-[256px] animate-pulse rounded-[12px] bg-white/10"
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
