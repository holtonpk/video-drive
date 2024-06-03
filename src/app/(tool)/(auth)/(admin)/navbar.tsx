"use client";
import React from "react";
import Link from "next/link";
import {Icons} from "@/components/icons";
import {buttonVariants} from "@/components/ui/button";
import {useSelectedLayoutSegment} from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {clients} from "@/config/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useAuth} from "@/context/user-auth";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";

const Navbar = () => {
  const segment = useSelectedLayoutSegment();
  const {currentUser, logOut} = useAuth()!;

  return (
    <div className="justify-between top-0 gap-8 p-4 items-center z-[50] bg-muted px-6 hidden sm:flex">
      <NavigationMenu>
        <NavigationMenuList className="gap-8">
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink
                className={`font-bold
        ${
          segment === "(video-sheet)"
            ? "text-primary "
            : "text-muted-foreground hover:text-primary"
        }
        `}
              >
                Video Sheet
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/posting" legacyBehavior passHref>
              <NavigationMenuLink
                className={`font-bold
        ${
          segment === "posting"
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        }
        `}
              >
                Post Schedule
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={`p-0 text-base bg-transparent font-bold
             ${
               segment === "video-planning"
                 ? "text-primary"
                 : "text-muted-foreground hover:text-primary"
             }`}
            >
              Video Planning
            </NavigationMenuTrigger>

            <NavigationMenuContent>
              <ul className="grid gap-3 p-2 md:w-[400px] lg:w-[500px] ">
                {clients.map((client) => {
                  return (
                    <li key={client.id} className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          href={`/client-view/${client.value}`}
                          className={
                            "flex gap-2 items-center select-none space-y-1 rounded-md p-3 leading-none no-underline  outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          }
                        >
                          <client.icon className="h-6 w-6" />
                          <div className="text-base font-bold leading-none">
                            {client.label}
                          </div>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  );
                })}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {currentUser && (
        <div className="flex gap-2 items-center text-foreground md:ml-auto">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={currentUser?.photoURL}
              alt={currentUser.displayName || "User"}
            />
            <AvatarFallback>
              {currentUser?.firstName?.charAt(0).toUpperCase() +
                currentUser?.lastName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-xl">
              {currentUser.displayName}
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" w-[100px]">
              <DropdownMenuLabel>Your Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/settings">Notifications</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-destructive/30">
                <button onClick={logOut} className=" text-destructive">
                  Logout
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

export default Navbar;
