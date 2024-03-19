"use client";
import React from "react";
import Link from "next/link";
import {Icons} from "@/components/icons";
import {buttonVariants} from "@/components/ui/button";
import {useSelectedLayoutSegment} from "next/navigation";

const Navbar = () => {
  const segment = useSelectedLayoutSegment();
  return (
    <div className="justify-between top-0 flex gap-8 p-4 items-center z-[50] bg-muted px-6">
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className={`font-bold
        ${
          segment === "(video-sheet)"
            ? "text-primary "
            : "text-muted-foreground hover:text-primary"
        }
        `}
        >
          Video Sheet
        </Link>
        <Link
          href="/posting"
          className={`font-bold
        ${
          segment === "posting"
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        }
        `}
        >
          Post Schedule
        </Link>
        <Link
          href="/posting"
          className={`font-bold
        ${
          segment === "video-planning"
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        }
        `}
        >
          Video Planning
        </Link>
      </div>
      <div className="flex items-center">
        <Link
          href={"/new-video"}
          className={buttonVariants({variant: "default"})}
        >
          <Icons.add className="h-5 w-5 mr-2" />
          New Video
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
