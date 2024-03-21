import {ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

// import { env } from "@/env.mjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Timestamp = {
  nanoseconds: number;
  seconds: number;
};

export function formatDateFromTimestamp(timestamp: Timestamp | any): string {
  // Convert the seconds to milliseconds (JavaScript Date uses milliseconds)
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString(); // Convert the date to a local date string
}

export const convertTimestampToDate = (timestamp: Timestamp): Date => {
  const milliseconds =
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
  return new Date(milliseconds);
};
