import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "@radix-ui/react-icons";
import {
  BlazeLogo,
  MortyLogo,
  FcLogo,
  YoutubeLogo,
  InstagramLogo,
  TiktokLogo,
  LearnXYZLogo,
} from "@/components/icons";
import {Icons} from "@/components/icons";
import {OutputData} from "@editorjs/editorjs";
import {Pencil, Circle, CircleCheckBig, CircleX} from "lucide-react";

export const ADMIN_USERS = [
  "Mi4yipMXrlckU117edbYNiwrmI92",
  "3tUbkjbrK9gZ86byUxpbdGsdWyj1",
];
export const EDITORS = [
  "orxFlEC5v8euefk1OSJVTVXgilE2",
  "y9VhFCzIuRW33vjKhmVrpqH4ajx2",
];

export type Notifications = {
  email: string;
  new_video: boolean;
  revision: boolean;
  done: boolean;
  notes: boolean;
};

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

export const statuses = [
  {
    value: "draft",
    label: "Draft",
    icon: Pencil,
    description:
      "The videos is planned. But still needs the script or assets added",
  },
  {
    value: "todo",
    label: "Todo",
    icon: Circle,
    description: "Ready for edit",
  },
  {
    value: "done",
    label: "Done",
    icon: CircleCheckBig,
    description: "Editing is finished and the video is ready for upload.",
  },
  {
    value: "needs revision",
    label: "Needs Revision",
    icon: CircleX,
    description: "The video needs to be revised.",
  },
];

export const editorStatuses = [
  {
    value: "todo",
    label: "Todo",
    icon: Circle,
    description: "Ready for edit",
  },
  {
    value: "done",
    label: "Done",
    icon: CircleCheckBig,
    description: "Editing is finished and the video is ready for upload.",
  },
  {
    value: "needs revision",
    label: "Needs Revision",
    icon: CircleX,
    description: "The video needs to be revised.",
  },
];

export const clients = [
  {
    id: "1",
    value: "blaze",
    label: "Blaze",
    icon: BlazeLogo,
    description:
      "Say goodbye to ordinary marketing. Embrace ai-driven success with our cutting-edge tools. The largest AI models don't know what works for your brand and product.",
  },
  {
    id: "2",
    value: "morty",
    label: "Morty",
    icon: MortyLogo,
    description: "Blaze is a company that sells candles.",
  },
  {
    id: "3",
    value: "founderCentral",
    label: "Founder Central",
    icon: FcLogo,
    description:
      "Viral Factory create viral short video that are perfect for social media.",
  },
  {
    id: "4",
    value: "learnXYZ",
    label: "Learn XYZ",
    icon: LearnXYZLogo,
    description: "Explore bite-sized Learning with the magic of AI",
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
];

export const platforms = [
  {
    label: "Youtube",
    value: "youtube",
    icon: YoutubeLogo,
  },
  {
    label: "Instagram",
    value: "instagram",
    icon: InstagramLogo,
  },
  {
    label: "Tiktok",
    value: "tiktok",
    icon: TiktokLogo,
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

type UpdatedAt = {
  time: Timestamp;
  user: string;
};

export type VideoData = {
  id: number;
  title: string;
  videoNumber: string;
  scriptDueDate: Timestamp;
  videoURL?: string;
  postIds?: string[];
  dueDate: Timestamp;
  clientId: string;
  status: string;
  assets: VideoAsset[];
  voiceOver: VideoAsset[];
  notes: string;
  script: OutputData | string;
  caption?: string;
  postDate: Timestamp;
  uploadedVideos?: UploadedVideo[];
  editor?: string;
  editorNotes?: string;
  updatedAt: UpdatedAt;
};

type UploadedVideo = {
  id: string;
  title: string;
  videoURL: string;
};

export type VideoDataWithPosts = {
  id: number;
  title: string;
  videoNumber: string;
  scriptDueDate: Timestamp;
  videoURL?: string;
  postIds: string[];
  posts: Post[];
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
