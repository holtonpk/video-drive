"use client";

import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge";
import {Checkbox} from "@/components/ui/checkbox";
import {Icons} from "@/components/icons";
import {labels, clients, statuses} from "@/config/data";
import {Video} from "../data/schema";
import {DataTableColumnHeader} from "./data-table-column-header";
import {DataTableRowActions} from "./data-table-row-actions";
import {formatDateFromTimestamp} from "@/lib/utils";
import Link from "next/link";

export const columns: ColumnDef<Video>[] = [
  {
    id: "select",
    header: ({table}) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({row}) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px] z-20 relative"
      />
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "videoNumber",
    header: ({column}) => (
      <DataTableColumnHeader column={column} title="Video #" />
    ),
    cell: ({row}) => (
      <div className="w-[80px] z-20 relative">
        {row.getValue("videoNumber")}
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: ({column}) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({row}) => (
      <div className="w-[150px]  z-20 relative whitespace-nowrap text-ellipsis overflow-hidden pointer-events-none">
        {row.getValue("title")}
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "dueDate",
    header: ({column}) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({row}) => {
      return (
        <div className="flex space-x-2 z-20 relative pointer-events-none">
          <span className="max-w-[500px] truncate font-medium">
            {formatDateFromTimestamp(row.getValue("dueDate"))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({column}) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({row}) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      return (
        <div
          className={`flex w-[150px] items-center z-20 relative pointer-events-none
        `}
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
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "clientId",
    header: ({column}) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
    cell: ({row}) => {
      const client = clients.find(
        (client) => client.value === row.getValue("clientId")
      );

      if (!client) {
        return null;
      }

      return (
        <div className="flex items-center z-20 relative pointer-events-none">
          {client.icon && <client.icon className=" h-8 w-8 rounded-lg" />}
          {/* <span>{client.label}</span> */}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "notes",
    header: ({column}) => (
      <DataTableColumnHeader column={column} title="Notes" />
    ),
    cell: ({row}) => {
      const note: string = row.getValue("notes");
      return (
        <div className="flex z-20  w-[200px] items-center ">
          <span className="w-fit  truncate font-medium ">{note}</span>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "videoURL",
    header: ({column}) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Video Uploaded"
          className="w-fit  whitespace-nowrap "
        />
      );
    },
    cell: ({row}) => {
      const videoUploaded = row.getValue("videoURL") ? true : false;
      return (
        <div className="flex z-20  w-full  justify-center items-center ">
          <span className="w-fit  truncate font-medium ">
            {videoUploaded ? (
              <Icons.check className="h-4 w-4 text-green-500" />
            ) : (
              <Icons.close className="h-4 w-4 text-red-500" />
            )}
          </span>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "script",
    header: ({column}) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Has Script"
          className="whitespace-nowrap"
        />
      );
    },
    cell: ({row}) => {
      const videoUploaded = row.getValue("script") ? true : false;
      return (
        <div className="flex z-20  w-full justify-center items-center ">
          <span className="w-fit  truncate font-medium ">
            {videoUploaded ? (
              <Icons.check className="h-4 w-4 text-green-500" />
            ) : (
              <Icons.close className="h-4 w-4 text-red-500" />
            )}
          </span>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "scriptDueDate",
    header: ({column}) => {
      return (
        <DataTableColumnHeader
          column={column}
          title="Script Due"
          className="whitespace-nowrap"
        />
      );
    },
    cell: ({row}) => {
      return (
        <div className="flex z-20  w-full justify-center items-center ">
          <span className="w-fit  truncate font-medium ">
            {formatDateFromTimestamp(row.getValue("scriptDueDate"))}
          </span>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({row}) => <DataTableRowActions row={row} />,
  },
  {
    id: "link",
    cell: ({row}) => {
      return (
        <Link
          target="_blank"
          href={`/video/${row.getValue("videoNumber")}`}
          className="absolute cursor-pointer w-full h-full left-0 top-0 z-10 "
        />
      );
    },
  },
];
