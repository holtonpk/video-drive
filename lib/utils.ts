import {ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";
import {Metadata} from "next";
import {format} from "date-fns";
import {differenceInWeeks} from "date-fns";

// import { env } from "@/env.mjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Timestamp = {
  nanoseconds: number;
  seconds: number;
};

export function convertToUserLocalTime(timestamp: Timestamp): string {
  // Create a Date object from the EST Timestamp
  const estDate = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );

  // EST offset in minutes (-5 hours)
  const estOffset = -5 * 60;

  // Get the user's local timezone offset in minutes
  const userTimezoneOffset = estDate.getTimezoneOffset(); // In minutes
  const userTimezoneOffsetKey = (-userTimezoneOffset).toString();

  // Convert EST to the user's local time by adding the offset difference
  const localTime = new Date(
    estDate.getTime() + (estOffset - userTimezoneOffset) * 60000
  );

  // Format the local time using date-fns
  const formattedDate = format(localTime, "iiii M/d h:mm a");

  // Get the timezone abbreviation from the map
  const timezoneAbbreviation =
    timezoneMap[userTimezoneOffsetKey] || "Unknown Timezone";

  // Return the formatted date with timezone in parentheses
  return `${formattedDate} (${timezoneAbbreviation})`;
}

export function formatDateFromTimestamp(timestamp: Timestamp | any): string {
  // Convert the seconds to milliseconds (JavaScript Date uses milliseconds)
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString(); // Convert the date to a local date string
}

export function formatDayMonthDay(timestamp: Timestamp | any): string {
  // Convert the seconds to milliseconds (JavaScript Date uses milliseconds)
  const date = new Date(timestamp.seconds * 1000);

  // Define options for formatting the date with EST time zone
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/New_York", // US Eastern Time
    month: "numeric", // Numeric month (e.g., 4)
    day: "numeric", // Numeric day (e.g., 3)
  };

  return date.toLocaleDateString(undefined, options); // Convert the date to a formatted string
}

export function formatDaynameMonthDay(timestamp: Timestamp | any): string {
  // Convert the seconds to milliseconds (JavaScript Date uses milliseconds)
  const date = new Date(timestamp.seconds * 1000);

  // Define options for formatting the date
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short", // Short weekday name (e.g., Fri)
    month: "numeric", // Numeric month (e.g., 4)
    day: "numeric", // Numeric day (e.g., 3)
  };

  return date.toLocaleDateString(undefined, options); // Convert the date to a formatted string
}

export function formatMonthDayYear(timestamp: Timestamp | any): string {
  // Convert the seconds to milliseconds (JavaScript Date uses milliseconds)
  const date = new Date(timestamp.seconds * 1000);

  // Define options for formatting the date
  const options: Intl.DateTimeFormatOptions = {
    month: "short", // Short month name (e.g., Oct)
    day: "numeric", // Numeric day (e.g., 22)
    year: "numeric", // Full year (e.g., 2024)
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

export const convertDateToTimestamp = (date: Date): Timestamp => {
  const milliseconds = date.getTime(); // Total milliseconds since epoch
  const seconds = Math.floor(milliseconds / 1000); // Whole seconds
  const nanoseconds = (milliseconds % 1000) * 1000000; // Remaining milliseconds converted to nanoseconds
  return {seconds, nanoseconds};
};

export function constructMetadata({
  title = "Whitespace Media",
  description = "We specialize in organic marketing",
  image = `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
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
      images: [
        {
          url: image,
        },
      ],
    },
    icons: {
      icon: `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
      shortcut: `${process.env.NEXT_PUBLIC_SITE_URL}/image/favicon.ico`,
      apple: `${process.env.NEXT_PUBLIC_SITE_URL}/image/apple-touch-icon.png`,
    },
    metadataBase: new URL("http://whitespace-media.com"),
    themeColor: "#FFF",
  };
}

export function formatAsUSD(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function calculateTotalWeeksRemaining(
  currentDate: Date,
  timestamps: Timestamp[]
): number {
  let totalWeeksRemaining = 0;

  timestamps.forEach((timestamp: Timestamp) => {
    const taskDate = convertTimestampToDate(timestamp);
    const weeksRemaining = differenceInWeeks(taskDate, currentDate);

    // Only count weeks that are in the future
    if (weeksRemaining > 0) {
      totalWeeksRemaining += weeksRemaining;
    }
  });

  return totalWeeksRemaining;
}

const timezoneMap: {[key: string]: string} = {
  "-720": "UTC-12",
  "-660": "HST", // Hawaii Standard Time, UTC-10
  "-600": "HDT", // Hawaii-Aleutian Daylight Time, UTC-10
  "-540": "AKST", // Alaska Standard Time, UTC-9
  "-480": "PST", // Pacific Standard Time, UTC-8
  "-420": "MST", // Mountain Standard Time, UTC-7
  "-360": "CST", // Central Standard Time, UTC-6
  "-300": "EST", // Eastern Standard Time, UTC-5
  "-240": "AST", // Atlantic Standard Time, UTC-4
  "-180": "ADT", // Atlantic Daylight Time, UTC-4
  "-120": "PMST", // Pierre & Miquelon Standard Time, UTC-3
  "-60": "PMDT", // Pierre & Miquelon Daylight Time, UTC-3
  "0": "UTC", // Coordinated Universal Time, UTC
  "60": "CET", // Central European Time, UTC+1
  "120": "EET", // Eastern European Time, UTC+2
  "180": "MSK", // Moscow Time, UTC+3
  "240": "GST", // Gulf Standard Time, UTC+4
  "300": "PKT", // Pakistan Standard Time, UTC+5
  "330": "IST", // India Standard Time, UTC+5:30
  "360": "BST", // Bangladesh Standard Time, UTC+6
  "420": "ICT", // Indochina Time, UTC+7
  "480": "CST", // China Standard Time, UTC+8
  "540": "JST", // Japan Standard Time, UTC+9
  "600": "AEST", // Australian Eastern Standard Time, UTC+10
  "660": "ACST", // Australian Central Standard Time, UTC+9:30
  "720": "AEDT", // Australian Eastern Daylight Time, UTC+11
  "780": "NZDT", // New Zealand Daylight Time, UTC+13
  "840": "ChST", // Chamorro Standard Time, UTC+10
};

export const formatTimeDifference = (timestamp: Timestamp): string => {
  const now = new Date();
  const timestampDate = convertTimestampToDate(timestamp);
  const diffMs = now.getTime() - timestampDate.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHrs = Math.round(diffMin / 60);
  const diffDays = Math.round(diffHrs / 24);
  const diffWeeks = Math.round(diffDays / 7);

  if (diffSec < 60) {
    return "just now";
  } else if (diffMin < 60) {
    return `${diffMin} min`;
  } else if (diffHrs < 24) {
    return `${diffHrs} hr${diffHrs === 1 ? "" : "s"}`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"}`;
  } else {
    return `${diffWeeks} week${diffWeeks === 1 ? "" : "s"}`;
  }
};

export const isDueDateBeforeToday = (dueDate: Date) => {
  // Convert task.dueDate to a date object and reset time to midnight
  const dueDateObj = new Date(dueDate);
  dueDateObj.setHours(0, 0, 0, 0);

  // Get today's date and reset time to midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Compare the dates
  return dueDateObj < today;
};
