import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="justify-center top-0 flex gap-8 p-4 items-center bg-background z-[50]">
      <Link href="/">Video Sheet</Link>
      <Link href="/new-video">New Video</Link>
      <Link href="/posting">Post Schedule</Link>
    </div>
  );
};

export default Navbar;
