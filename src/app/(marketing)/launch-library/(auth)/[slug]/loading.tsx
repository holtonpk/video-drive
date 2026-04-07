import {NavBar} from "../../../navbar";
import {Footer} from "../../../footer";
import {LoaderCircleIcon} from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <main className="flex flex-1 flex-col lg:px-6 pt-2 pb-[250px] lg:pb-10 text-white max-w-screen">
        <div className="grid w-full max-w-full min-w-0 gap-4 items-start h-fit lg:grid-cols-[minmax(0,1fr)_450px]">
          <div className="flex min-w-0 flex-col max-w-full gap-4">
            <div className="flex w-full aspect-video items-center justify-center bg-black shadow-lg shadow-black lg:rounded-[12px]">
              <LoaderCircleIcon className="h-20 w-20 animate-spin text-white" />
            </div>

            <div className="max-w-screen">
              <div className="flex h-fit flex-col gap-3 lg:p-4">
                <div className="flex w-full flex-col items-start justify-between gap-4 px-4 pt-2 lg:p-0 xl:flex-row">
                  <div className="flex w-full flex-row flex-wrap items-center gap-1 lg:w-fit">
                    <div className="ml-[6px] mr-2 h-8 w-8 shrink-0 rounded-full bg-white/5 lg:h-10 lg:w-10" />
                    <div
                      className={`h-8 w-[200px] animate-pulse rounded-full bg-white/5 lg:h-10`}
                    />
                  </div>
                  <div className="flex w-full flex-col items-start justify-between gap-4 lg:w-fit lg:flex-row lg:items-center">
                    <div className="flex flex-wrap gap-4">
                      <div
                        className={`h-10 w-[100px] animate-pulse rounded-full bg-white/5`}
                      />

                      <div
                        className={`h-10 w-[100px] animate-pulse rounded-full bg-white/5`}
                      />
                      <div
                        className={`h-10 w-[100px] animate-pulse rounded-full bg-white/5`}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 bg-[#1e1e1e] p-4 lg:mt-3 lg:rounded-[12px]">
                  <div className="flex flex-col gap-1">
                    <div
                      className={`h-6 w-[100px] animate-pulse rounded-full bg-white/5`}
                    />

                    <div
                      className={`h-10 w-[full] animate-pulse rounded-full bg-white/5`}
                    ></div>
                    <div
                      className={`h-10 w-[full] animate-pulse rounded-full bg-white/5`}
                    ></div>
                    <div
                      className={`h-10 w-[full] animate-pulse rounded-full bg-white/5`}
                    ></div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 bg-white/5 p-4 lg:mt-3 lg:rounded-[12px]">
                  <div className="flex flex-col gap-1">
                    <div
                      className={`h-6 w-[100px] animate-pulse rounded-full bg-white/5`}
                    />
                    <div className="flex flex-wrap gap-2">
                      <div
                        className={`h-10 w-[100px] animate-pulse rounded-full bg-white/5`}
                      />
                      <div
                        className={`h-10 w-[100px] animate-pulse rounded-full bg-white/5`}
                      />
                      <div
                        className={`h-10 w-[100px] animate-pulse rounded-full bg-white/5`}
                      />
                      <div
                        className={`h-10 w-[100px] animate-pulse rounded-full bg-white/5`}
                      />
                      <div
                        className={`h-10 w-[100px] animate-pulse rounded-full bg-white/5`}
                      />
                      <div
                        className={`h-10 w-[100px] animate-pulse rounded-full bg-white/5`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex min-w-0 max-w-full flex-col">
            <div className="relative mt-4 w-full max-w-full min-w-0 overflow-hidden lg:mt-0" />
            <div className="mt-2 flex min-w-0 w-full flex-col grid-cols-1 place-items-center gap-8 lg:grid lg:gap-0" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
