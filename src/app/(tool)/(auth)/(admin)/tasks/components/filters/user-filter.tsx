"use client";

import React, {use, useEffect, useState} from "react";
import {Icons} from "@/components/icons";
import {PlusCircle} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {USERS} from "@/src/app/(tool)/(auth)/(admin)/tasks/data";
import {useAuth, UserData} from "@/context/user-auth";

export function FilterUser({
  userData,
  selectedUsers,
  setSelectedUsers,
}: {
  userData: UserData[];
  selectedUsers: string[] | undefined;
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}) {
  const {currentUser} = useAuth()!;

  console.log("selectedUsers 0000", userData);

  return (
    <div className=" flex h-9 items-center p-1 rounded-md border border-primary/30 overflow-hidden border-dashed">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-full  text-primary bg-foreground dark:bg-muted"
          >
            <PlusCircle className="mr-1 h-4 w-4" />
            Tasks for
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-1 h-fit" align="start">
          <>
            {userData.map((user) => (
              <button
                onClick={() => {
                  if (selectedUsers?.includes(user.uid)) {
                    setSelectedUsers(
                      selectedUsers?.filter((u) => u != user.uid)
                    );
                  } else {
                    setSelectedUsers([...(selectedUsers || []), user.uid]);
                  }
                }}
                key={user.uid}
                className="w-full px-8 p-2 h-fit flex items-center gap-2 hover:bg-muted"
              >
                <img
                  src={user.photoURL}
                  alt={user.firstName}
                  className="h-6 w-6 rounded-full"
                />
                {user.uid == currentUser?.uid ? "You" : user.firstName}
                {selectedUsers?.includes(user.uid) && (
                  <Icons.check className="h-4 w-4 text-primary ml-auto absolute left-2" />
                )}
              </button>
            ))}
          </>
        </PopoverContent>
      </Popover>
      {selectedUsers && selectedUsers?.length > 0 && (
        <>
          <Separator
            orientation="vertical"
            className="mx-2 h-[50%] bg-primary/50"
          />
          <div className="flex gap-1">
            {selectedUsers.map((user) => (
              <div
                key={user}
                className="bg-foreground dark:bg-muted text-primary h-full rounded-sm px-2 flex items-center gap-1 text-sm"
              >
                <button
                  onClick={() => {
                    setSelectedUsers(selectedUsers?.filter((u) => u != user));
                  }}
                  className="hover:text-primary/70"
                >
                  <Icons.close className="h-3 w-3" />
                </button>
                {user == currentUser?.uid
                  ? "You"
                  : userData?.find((u) => u.uid == user)?.firstName}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
