import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import {Icons} from "@/components/icons";
import {BlazeLogo, MortyLogo, FcLogo} from "@/components/icons";
import {object} from "zod";

export const statuses = [
  {
    value: "todo",
    label: "Todo",
    icon: CircleIcon,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: StopwatchIcon,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircledIcon,
  },
  {
    value: "needs revision",
    label: "Needs Revision",
    icon: CrossCircledIcon,
  },
];

export const clients = [
  {
    value: "morty",
    label: "Morty",
    icon: MortyLogo,
  },
  {
    value: "blaze",
    label: "Blaze",
    icon: BlazeLogo,
  },
  {
    value: "founderCentral",
    label: "Founder Central",
    icon: FcLogo,
  },
];

export type VideoAsset = {
  title: string;
  url: string;
};

type status = {
  value: string;
  label: string;
  icon: typeof Icons;
};

export type Platforms = "youtube" | "instagram" | "tiktok" | "all";

export type Post = {
  id: string;
  title: string;
  videoURL?: string;
  platforms?: Platforms[];
  notes?: string;
  clientId: string;
  caption?: string;
  postDate: Timestamp;
};

export type UploadedVideo = {};

export type VideoData = {
  id: number;
  title: string;
  videoNumber: number;
  videoURL?: string;
  postIds?: string[];
  dueDate: Timestamp;
  clientId: string;
  status: string;
  assets: VideoAsset[];
  notes: string;
  script: string;
  caption?: string;
  postDate: Timestamp;
};

interface Timestamp {
  nanoseconds: number;
  seconds: number;
}
