import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "@radix-ui/react-icons";
import {BlazeLogo, MortyLogo, FcLogo} from "@/components/icons";
import {Icons} from "@/components/icons";

import {Pencil, Circle, CircleCheckBig, CircleX} from "lucide-react";

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

export const clients = [
  {
    id: "1",
    value: "blaze",
    label: "Blaze",
    icon: BlazeLogo,
  },
  {
    id: "2",
    value: "morty",
    label: "Morty",
    icon: MortyLogo,
  },
  {
    id: "3",
    value: "founderCentral",
    label: "Founder Central",
    icon: FcLogo,
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
  },
  {
    label: "Instagram",
    value: "instagram",
  },
  {
    label: "Tiktok",
    value: "tiktok",
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
  videoNumber: string;
  scriptDueDate: Timestamp;
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
