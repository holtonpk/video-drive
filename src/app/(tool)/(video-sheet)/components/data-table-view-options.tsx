"use client";
import React from "react";
import {DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {MixerHorizontalIcon} from "@radix-ui/react-icons";
import {Table} from "@tanstack/react-table";

import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {Column} from "@tanstack/react-table";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const DEFAULTHIDDENCOLUMNS: string[] = ["script"]; // Define your default hidden columns here
  const [userHiddenColumns, setUserHiddenColumns] = React.useState<
    string[] | undefined
  >(() => {
    const storedHiddenColumns = localStorage.getItem("hiddenColumns");
    return storedHiddenColumns
      ? JSON.parse(storedHiddenColumns)
      : DEFAULTHIDDENCOLUMNS;
  });

  React.useEffect(() => {
    // This effect sets the initial visibility of columns based on local storage
    table.getAllColumns().forEach((column) => {
      column.toggleVisibility(!userHiddenColumns?.includes(column.id));
    });
  }, []); // Runs only once on mount

  React.useEffect(() => {
    console.log("setting local to ", userHiddenColumns);
    localStorage.setItem("hiddenColumns", JSON.stringify(userHiddenColumns));
  }, [userHiddenColumns]);

  const toggleHiddenColumn = (
    column: Column<TData, unknown>,
    value: boolean
  ) => {
    column.toggleVisibility(value);
    setUserHiddenColumns((prev) => {
      const newHiddenColumns = prev ? [...prev] : [];
      if (newHiddenColumns.includes(column.id)) {
        return newHiddenColumns.filter((id) => id !== column.id);
      } else {
        newHiddenColumns.push(column.id);
        return newHiddenColumns;
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={
                  userHiddenColumns && !userHiddenColumns.includes(column.id)
                }
                onCheckedChange={(value) => toggleHiddenColumn(column, !!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
