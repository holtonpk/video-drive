"use client";

import React, {useEffect} from "react";
import {clients} from "@/config/data";

import {CreateVideo} from "./components/create-videos";
import {WeeksDisplay} from "./components/weeks-display";

const ClientPage = ({client}: {client: string}) => {
  const clientInfo = clients.find((c: any) => c.value === client);
  const [totalVideos, setTotalVideos] = React.useState<number>(0);

  const [currentVideoNumber, setCurrentVideoNumber] = React.useState<number>(0);

  return (
    <>
      {clientInfo ? (
        <div className="container flex flex-col gap-4 py-8 relative">
          <div className="flex items-center gap-4 text-primary  w-fit justify-center">
            {clientInfo.icon && (
              <clientInfo.icon className="h-10 w-10 rounded-lg" />
            )}
            <span className="font-bold text-4xl">{clientInfo?.label}</span>
          </div>
          <span className="text-primary">
            Total Videos: {totalVideos.toString()}
          </span>

          <CreateVideo
            clientInfo={clientInfo}
            totalVideos={currentVideoNumber}
          />

          <WeeksDisplay
            clientInfo={clientInfo}
            setTotalVideos={setTotalVideos}
            setCurrentVideoNumber={setCurrentVideoNumber}
          />
        </div>
      ) : (
        <>Not found</>
      )}
    </>
  );
};

export default ClientPage;
