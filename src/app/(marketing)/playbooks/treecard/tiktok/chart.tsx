"use client";

import {
  TrendingUp,
  TrendingDown,
  Heart,
  Eye,
  MessageCircle,
  Share,
} from "lucide-react";
import {Area, AreaChart, CartesianGrid, XAxis, YAxis} from "recharts";
import {formatNumber} from "../instagram/instagram";
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

import TikTokDataFull from "../data/tiktok.json";

interface TikTokPostData {
  createTimeISO: string;
  playCount: number;
}

interface GroupedData {
  [key: string]: {
    date: string;

    tiktok: number;
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
const groupedData = TikTokDataFull.reduce(
  (acc: GroupedData, post: TikTokPostData) => {
    // Use the helper function to get the correct month
    const month = getMonthFromTimestamp(post.createTimeISO);

    if (!acc[month]) {
      acc[month] = {
        date: month,
        tiktok: 0,
        posts: 0,
      };
    }
    acc[month].tiktok += post.playCount;
    acc[month].posts += 1;
    return acc;
  },
  {}
);

// Add TikTok data to the grouped data the date for a tiktok post is called "createTimeISO"
const TikTokData = (TikTokDataFull as TikTokPostData[]).filter(
  (post) => post.createTimeISO
);

TikTokData.forEach((item) => {
  const month = getMonthFromTimestamp(item.createTimeISO);
  if (!groupedData[month]) {
    groupedData[month] = {
      date: month,
      tiktok: 0,
      posts: 0,
    };
  }
  groupedData[month].tiktok += item.playCount;
  groupedData[month].posts += 1;
});

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

      tiktok: post.tiktok,
      totalPosts: post.posts, // Renamed to totalPosts for clarity
    };
  })
  .sort((a, b) => a.dateValue.localeCompare(b.dateValue))
  .map(({date, tiktok, totalPosts}) => ({
    date,

    tiktok,
    totalPosts,
  })); // Remove the sorting key

console.log("cd", chartData);

// Calculate the trend percentage
const calculateTrend = () => {
  if (chartData.length < 2) return "0.0";

  // Get the current month data
  const currentMonth = chartData[chartData.length - 1];

  // Calculate average of all months
  const totalViews = chartData.reduce((sum, month) => sum + month.tiktok, 0);
  const averageViews = totalViews / chartData.length;

  // Calculate percentage change from average
  if (averageViews === 0) return "0.0";

  const percentageChange =
    ((currentMonth.tiktok - averageViews) / averageViews) * 100;
  return percentageChange.toFixed(1);
};

const trendPercentage = calculateTrend();
const isTrendingUp = parseFloat(trendPercentage) > 0;

const chartConfig = {
  tiktok: {
    label: "Views",
    color: "hsl(var(--chart-2))",
  },
  totalPosts: {
    label: "Total Posts",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function Chart({data}: {data: any[]}) {
  const averageLikes = Math.round(
    data.reduce((acc, tiktok) => acc + tiktok.diggCount, 0) / data.length
  );
  const averageViews = Math.round(
    data.reduce((acc, tiktok) => acc + tiktok.playCount, 0) / data.length
  );
  const averageComments = Math.round(
    data.reduce((acc, tiktok) => acc + tiktok.commentCount, 0) / data.length
  );
  const averageShares = Math.round(
    data.reduce((acc, tiktok) => acc + tiktok.shareCount, 0) / data.length
  );
  return (
    <Card className="rounded-md border-none shadow-none pb-0 ">
      <CardHeader>
        <CardTitle>TikTok Organic Content Performance</CardTitle>
        <CardDescription>
          Showing the performance of your TikTok organic content over the last
          year
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
              dataKey="tiktok"
              type="natural"
              fill="var(--color-tiktok)"
              fillOpacity={0.4}
              stroke="var(--color-tiktok)"
              name="tiktok"
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
      <CardFooter className="pb-0">
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex gap-2 font-bold text-[#00AE70]">
              {/* <TiktokLogo className="w-10 h-10" /> */}
              <h1 className=" font-bold text-[#00AE70]">Average Performance</h1>
              <h1 className="flex items-center gap-1">
                <Heart className="w-4 h-4" /> {formatNumber(averageLikes)}
              </h1>
              <h1 className="flex items-center gap-1">
                <Eye className="w-4 h-4" /> {formatNumber(averageViews)}
              </h1>
              <h1 className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />{" "}
                {formatNumber(averageComments)}
              </h1>
              <h1 className="flex items-center gap-1">
                <Share className="w-4 h-4" /> {formatNumber(averageShares)}
              </h1>
            </div>
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
