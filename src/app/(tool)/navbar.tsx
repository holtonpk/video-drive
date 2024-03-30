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
const Navbar = () => {
  const segment = useSelectedLayoutSegment();
  return (
    <div className="justify-between top-0 flex gap-8 p-4 items-center z-[50] bg-muted px-6">
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
    </div>
  );
};

export default Navbar;
