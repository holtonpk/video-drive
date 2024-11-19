"use client";

import React, {use, useEffect, useState} from "react";
import {Icons} from "@/components/icons";
import {PlusCircle} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {statuses} from "@/src/app/(tool)/(auth)/(admin)/tasks/data"


export function FilterStatus({
  selectedStatus,
  setSelectedStatus,
}: {
  selectedStatus: string[];
  setSelectedStatus: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <div className=" flex h-9  items-center p-1 rounded-md border border-primary/30 overflow-hidden border-dashed">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-full  text-primary bg-foreground dark:bg-muted"
          >
            <PlusCircle className="mr-1 h-4 w-4" />
            Status
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-1 h-fit" align="start">
          <>
            {statuses.map((status) => (
              <button
                key={status.value}
                className="w-full px-8 p-2 h-fit flex items-center gap-2 hover:bg-muted"
                onClick={() => {
                  if (selectedStatus?.includes(status.value)) {
                    setSelectedStatus(
                      selectedStatus?.filter((u) => u != status.value)
                    );
                  } else {
                    setSelectedStatus([
                      ...(selectedStatus || []),
                      status.value,
                    ]);
                  }
                }}
              >
                {status.icon}
                {status.label}
                {selectedStatus?.includes(status.value) && (
                  <Icons.check className="h-4 w-4 text-primary ml-auto absolute left-2" />
                )}
              </button>
            ))}
          </>
        </PopoverContent>
      </Popover>
      {selectedStatus?.length > 0 && (
        <>
          <Separator
            orientation="vertical"
            className="mx-2 h-[50%] bg-primary/50"
          />
          <div className="flex gap-1">
            {selectedStatus.map((status) => (
              <div
                key={status}
                className="bg-foreground dark:bg-muted  text-primary h-full rounded-sm px-2 flex items-center gap-1 text-sm"
              >
                <button
                  onClick={() => {
                    setSelectedStatus(
                      selectedStatus?.filter((u) => u != status)
                    );
                  }}
                  className="hover:text-primary/70"
                >
                  <Icons.close className="h-3 w-3" />
                </button>
                {statuses.find((u) => u.value == status)?.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}