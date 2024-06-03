"use client";
import * as React from "react";
import {DotsHorizontalIcon} from "@radix-ui/react-icons";
import {Row} from "@tanstack/react-table";

import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {videoSchema} from "../data/schema";
import {statuses} from "@/config/data";
import {doc, deleteDoc, setDoc} from "firebase/firestore";
import {db} from "@/config/firebase";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/user-auth";
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = videoSchema.parse(row.original);
  const {currentUser} = useAuth()!;

  async function handleDelete() {
    const docRef = doc(db, "videos/", task.videoNumber.toString());
    deleteDoc(docRef);
    setShowDeleteDialog(false);
    // reload the page
    window.location.reload();
  }

  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  async function updateStatus(status: string) {
    await setDoc(
      doc(db, "videos", task.videoNumber.toString()),
      {
        status: status,
        updatedAt: {date: new Date(), user: currentUser?.firstName},
      },
      {
        merge: true,
      }
    );
    window.location.reload();
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted z-20 relative"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={task.videoNumber.toString()}>
                {statuses.map((status) => (
                  <DropdownMenuRadioItem
                    key={status.value}
                    value={status.value}
                    onClick={() => updateStatus(status.value)}
                  >
                    {status.icon && (
                      <status.icon
                        className={`mr-2 h-4 w-4 
          ${
            status.value === "done"
              ? "text-green-500"
              : status.value === "todo"
              ? "text-blue-500"
              : status.value === "draft"
              ? "text-yellow-500"
              : "text-red-500"
          }
          `}
                      />
                    )}
                    {status.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete video #{task.videoNumber}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Once you delete a video, it cannot be recovered.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive hover:opacity-80"
            >
              Delete Video
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
