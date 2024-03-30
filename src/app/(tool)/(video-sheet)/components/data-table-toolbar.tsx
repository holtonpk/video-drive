"use client";
import * as React from "react";
import {Cross2Icon} from "@radix-ui/react-icons";
import {Table} from "@tanstack/react-table";
import {addDays, format, set, subDays} from "date-fns";
import {cn} from "@/lib/utils";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {DataTableViewOptions} from "@/src/app/(tool)/(video-sheet)/components/data-table-view-options";
import {Calendar as CalendarIcon} from "lucide-react";
import {DateRange} from "react-day-picker";
import {statuses, clients} from "@/config/data";
import {DataTableFacetedFilter} from "./data-table-faceted-filter";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({table}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [filterDate, setFilterDate] = React.useState<DateRange | undefined>();

  // React.useEffect(() => {
  //   if (filterDate && filterDate.to && filterDate.from) {
  //     const from = filterDate.from
  //       ? set(filterDate.from, {hours: 0, minutes: 0, seconds: 0})
  //       : undefined;
  //     const to = filterDate.to
  //       ? set(filterDate.to, {hours: 23, minutes: 59, seconds: 59})
  //       : undefined;
  //     console.log("from", from, "to", to);
  //     table.getColumn("dueDate")?.setFilterValue();
  //   }
  // }, [filterDate]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search video..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("clientId") && (
          <DataTableFacetedFilter
            column={table.getColumn("clientId")}
            title="Client"
            options={clients}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}

        <DatePickerWithRange date={filterDate} setDate={setFilterDate} />
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}

export function DatePickerWithRange({
  date,
  setDate,
}: {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}) {
  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Select a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
