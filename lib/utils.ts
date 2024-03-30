import {ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import {Metadata} from "next";

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

export function formatDayMonthDay(timestamp: Timestamp | any): string {
  // Convert the seconds to milliseconds (JavaScript Date uses milliseconds)
  const date = new Date(timestamp.seconds * 1000);

  // Define options for formatting the date
  const options: Intl.DateTimeFormatOptions = {
    // weekday: "short", // Short weekday name (e.g., Fri)
    month: "numeric", // Numeric month (e.g., 4)
    day: "numeric", // Numeric day (e.g., 3)
  };

  return date.toLocaleDateString(undefined, options); // Convert the date to a formatted string
}

export function formatDateFromTimestampToTime(
  timestamp: Timestamp | any
): string {
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleTimeString(); // Convert the date to a local date string
}

export const convertTimestampToDate = (timestamp: Timestamp): Date => {
  const milliseconds =
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
  return new Date(milliseconds);
};

export function constructMetadata({
  title = "Video Drive",
  description = "Founder Central Agency Video Drive",
  image = "image/favicon.ico",
}: {
  title?: string;
  description?: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      // images: [
      //   {
      //     url: image,
      //   },
      // ],
    },
    // icons: {
    //   icon: "image/favicon.ico",
    //   shortcut: "image/favicon-16x16.png",
    //   apple: "image/apple-touch-icon.png",
    // },
    // metadataBase: new URL("https://moltar.ai"),
    themeColor: "#FFF",
  };
}
