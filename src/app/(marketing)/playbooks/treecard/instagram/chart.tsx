"use client";

import {TrendingUp, TrendingDown} from "lucide-react";
import {Area, AreaChart, CartesianGrid, XAxis, YAxis} from "recharts";
import {formatNumber} from "./instagram";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import InstagramDataFull from "../data/instagram.json";

// Define the type for the Instagram data
interface InstagramPostData {
  type: string;
  timestamp: string;
  videoViewCount: number;
}

interface TikTokPostData {
  createTimeISO: string;
  playCount: number;
}

const InstagramData = (InstagramDataFull as InstagramPostData[]).filter(
  (post) => post.type === "Video" && post.timestamp
);

interface InstagramPost {
  timestamp: string;
  videoViewCount: number;
  id?: string;
  caption?: string;
  url?: string;
}

interface GroupedData {
  [key: string]: {
    date: string;
    instagram: number;

    posts: number; // Changed to string[] to store timestamps
  };
}

const formatMonth = (dateString: string | Date) => {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  return date.toLocaleString("default", {month: "short", year: "numeric"});
};

// Helper function to get the correct month from a timestamp
const getMonthFromTimestamp = (timestamp: string): string => {
  try {
    // Extract year and month directly from the timestamp string (YYYY-MM-DD format)
    const match = timestamp.match(/^(\d{4})-(\d{2})/);
    if (match) {
      const year = match[1];
      const month = match[2]; // This is already in the correct format (01-12)
      return `${year}-${month}`;
    }

    // Fallback to Date object if string parsing fails
    const date = new Date(timestamp);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", timestamp);
      return "unknown";
    }

    console.log(
      "date",
      date.toLocaleString("default", {month: "short"}),
      timestamp
    );

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  } catch (error) {
    console.error("Error parsing date:", timestamp, error);
    return "unknown";
  }
};

// group the data by month and sum the views
const groupedData = InstagramData.reduce(
  (acc: GroupedData, post: InstagramPost) => {
    // Use the helper function to get the correct month
    const month = getMonthFromTimestamp(post.timestamp);

    if (!acc[month]) {
      acc[month] = {
        date: month,
        instagram: 0,
        posts: 0,
      };
    }
    acc[month].instagram += post.videoViewCount;
    acc[month].posts += 1;
    return acc;
  },
  {}
);

// Convert grouped data to chart data format and sort by date
const chartData = Object.values(groupedData)
  .map((post) => {
    // Extract the month from the date string (YYYY-MM format)
    const [year, month] = post.date.split("-");
    // Create a date object for the first day of the month
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, 1);

    return {
      date: formatMonth(dateObj),
      dateValue: post.date, // Keep the original date for sorting
      instagram: post.instagram,

      totalPosts: post.posts, // Renamed to totalPosts for clarity
    };
  })
  .sort((a, b) => a.dateValue.localeCompare(b.dateValue))
  .map(({date, instagram, totalPosts}) => ({
    date,
    instagram,

    totalPosts,
  })); // Remove the sorting key

console.log("cd", chartData);

// Calculate the trend percentage
const calculateTrend = () => {
  if (chartData.length < 2) return "0.0";

  // Get the current month data
  const currentMonth = chartData[chartData.length - 1];

  // Calculate the average of all months
  const totalViews = chartData.reduce((sum, month) => sum + month.instagram, 0);
  const averageViews = totalViews / chartData.length;

  // Calculate percentage change from average
  if (averageViews === 0) return "0.0";

  const percentageChange =
    ((currentMonth.instagram - averageViews) / averageViews) * 100;
  return percentageChange.toFixed(1);
};

const trendPercentage = calculateTrend();
const isTrendingUp = parseFloat(trendPercentage) > 0;

const chartConfig = {
  instagram: {
    label: "Views",
    color: "hsl(var(--chart-1))",
  },

  totalPosts: {
    label: "Total Posts",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function Chart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instagram Organic Content Performance</CardTitle>
        <CardDescription>
          Showing the performance of your Instagram organic content over the
          last year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                formatNumber(Number(value)).toLocaleString()
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="instagram"
              type="natural"
              fill="var(--color-instagram)"
              fillOpacity={0.4}
              stroke="var(--color-instagram)"
              name="instagram"
            />

            <Area
              dataKey="totalPosts"
              type="natural"
              fill="var(--color-totalPosts)"
              fillOpacity={0.4}
              stroke="var(--color-totalPosts)"
              name="totalPosts"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {isTrendingUp ? (
                <>
                  Trending up by {trendPercentage}% this month{" "}
                  <TrendingUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Trending down by {Math.abs(parseFloat(trendPercentage))}% this
                  month <TrendingDown className="h-4 w-4" />
                </>
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {chartData.length > 0
                ? `${chartData[0].date} - ${
                    chartData[chartData.length - 1].date
                  }`
                : ""}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
