import {NavBar} from "../../../navbar";
import {Footer} from "../../../footer";
import {LoaderCircleIcon} from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      <main className="flex flex-1 flex-col md:px-6 pt-2 pb-[250px] text-white">
        <div className="grid md:grid-cols-[1fr_450px] gap-4 items-start h-fit">
          <div className="flex flex-col gap-4">
            <div className="w-full aspect-video bg-black rounded-[12px] flex items-center justify-center">
              <LoaderCircleIcon className="w-20 h-20 animate-spin text-white" />
            </div>

            <div className="px-4 md:px-0">
              <div className="flex pt-6 md:pt-4 h-fit flex-col gap-3  rounded-b-[12px] border-[1px] min-h-[90%] border-t-0 md:border-0  p-4">
                <div className=" flex flex-row md:items-start items-center gap-1">
                  <div className="h-12 w-12 md:h-10 md:w-10 ml-[6px] mr-4 shrink-0 rounded-full bg-white/5 " />
                  <div className="flex flex-col w-full md:flex-row items-start justify-between md:items-center gap-4 ">
                    <div className="flex gap-4">
                      <div
                        className={`text-4xl font-semibold w-[200px] h-10 rounded-full bg-white/5 animate-pulse`}
                      ></div>
                    </div>
                    <div className="flex gap-4">
                      <div
                        className={`text-lg w-[100px]  rounded-full bg-white/5 animate-pulse h-10  `}
                      ></div>

                      <div
                        className={`text-lg w-[100px]  rounded-full bg-white/5 animate-pulse h-10  `}
                      ></div>
                      <div
                        className={`text-lg w-[100px]  rounded-full bg-white/5 animate-pulse h-10  `}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-3 ">
                  <div className="flex flex-col gap-1 bg-white/5 p-4  rounded-[12px]">
                    <div
                      className={`text-xl font-bold w-[100px] rounded-full bg-white/5 animate-pulse h-6  `}
                    />

                    <div
                      className={`text-lg w-[full] rounded-full bg-white/5 animate-pulse h-10  `}
                    ></div>
                    <div
                      className={`text-lg w-[full] rounded-full bg-white/5 animate-pulse h-10  `}
                    ></div>
                    <div
                      className={`text-lg w-[full] rounded-full bg-white/5 animate-pulse h-10  `}
                    ></div>
                  </div>
                  <div className="flex flex-col gap-1 bg-white/5 p-4  rounded-[12px]">
                    <div
                      className={`text-xl font-bold w-[100px] rounded-full bg-white/5 animate-pulse h-6  `}
                    />
                    <div className="flex flex-wrap gap-2">
                      <div
                        className={`w-[100px] rounded-full bg-white/5 animate-pulse h-10  `}
                      />
                      <div
                        className={`w-[100px] rounded-full bg-white/5 animate-pulse h-10  `}
                      />
                      <div
                        className={`w-[100px] rounded-full bg-white/5 animate-pulse h-10  `}
                      />
                      <div
                        className={`w-[100px] rounded-full bg-white/5 animate-pulse h-10  `}
                      />
                      <div
                        className={`w-[100px] rounded-full bg-white/5 animate-pulse h-10  `}
                      />
                      <div
                        className={`w-[100px] rounded-full bg-white/5 animate-pulse h-10  `}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mt-2 grid grid-cols-1 gap-0 place-items-center"></div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
