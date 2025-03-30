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
  MindyLogo,
  FrizzleLogo,
  BlueCollarKeysLogo,
} from "@/components/icons";
import {Icons} from "@/components/icons";
import {OutputData} from "@editorjs/editorjs";
import {Pencil, Circle, CircleCheckBig, CircleX} from "lucide-react";

export const ADMIN_USERS = [
  "Mi4yipMXrlckU117edbYNiwrmI92",
  "3tUbkjbrK9gZ86byUxpbdGsdWyj1",
  "x9h3UepduwQHoCkwUh7bPGqEeTj2",
  "KWfkeozhuHhq95XIkuhUhLYmSci1",
];

export const EDITORS = [
  // "orxFlEC5v8euefk1OSJVTVXgilE2",
  {id: "y9VhFCzIuRW33vjKhmVrpqH4ajx2", clients: ["blaze", "morty", "frizzle"]},
  {
    id: "Mi4yipMXrlckU117edbYNiwrmI92",
    clients: [
      "blaze",
      "morty",
      "founderCentral",
      "learnXYZ",
      "mindy",
      "frizzle",
    ],
  },
  {
    id: "3tUbkjbrK9gZ86byUxpbdGsdWyj1",
    clients: [
      "blaze",
      "morty",
      "founderCentral",
      "learnXYZ",
      "mindy",
      "frizzle",
    ],
  },
];

export const ALL_USERS = [
  "y9VhFCzIuRW33vjKhmVrpqH4ajx2",
  "Mi4yipMXrlckU117edbYNiwrmI92",
  "3tUbkjbrK9gZ86byUxpbdGsdWyj1",
  "x9h3UepduwQHoCkwUh7bPGqEeTj2",
];

export const REVIEW_USERS_DATA = [
  {
    id: "3tUbkjbrK9gZ86byUxpbdGsdWyj1",
    name: "Mohammed",
  },
  {
    id: "Mi4yipMXrlckU117edbYNiwrmI92",
    name: "Patrick",
  },
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

export type ClientInfo = {
  id: string;
  value: string;
  label: string;
  description: string;
  assets: ClientAsset[];
};

type ClientAsset = {
  name: string;
  url: string;
  type: "img" | "video";
};

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
    id: "6",
    value: "blueCollarKeys",
    label: "Blue Collar Keys",
    icon: BlueCollarKeysLogo,
    description: "Blue Collar Keys is a company that sells keys.",
  },
  // {
  //   id: "4",
  //   value: "learnXYZ",
  //   label: "Learn XYZ",
  //   icon: LearnXYZLogo,
  //   description: "Explore bite-sized Learning with the magic of AI",
  // },
  // {
  //   id: "8762",
  //   value: "mindy",
  //   label: "Mindy",
  //   icon: MindyLogo,
  //   description:
  //     "Mindy can help with everything from complex research to shopping for great deals to organizing your meetings.",
  // },
  // {
  //   id: "5",
  //   value: "frizzle",
  //   label: "Frizzle AI",
  //   icon: FrizzleLogo,
  //   description:
  //     "Turn anything into a presentation. Frizzle AI is a presentation tool that uses AI to turn your ideas into beautiful slides.",
  // },
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
  uploaded?: boolean;
};

export type UpdatedAt = {
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
  script: ScriptData | string;
  caption?: string;
  postDate: Timestamp;
  uploadedVideos?: UploadedVideo[];
  editor?: string;
  editorNotes?: string;
  updatedAt: UpdatedAt;
  priceUSD: number;
  paid: boolean;
  posted?: boolean;
  scriptReviewed?: string[];
  videoReviewed?: string[];
  payoutChangeRequest?: PayoutChangeRequest;
  messages?: videoMessage[];
};

type ScriptData = {
  dd: OutputData;
};

export type videoMessage = {
  id: string;
  message: string;
  senderId: string;
  timestamp: Date;
  viewedBy: string[];
};

export type PayoutChangeRequest = {
  value: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: {date: Timestamp; user: string};
};

export type UploadedVideo = {
  id: string;
  title: string;
  videoURL: string;
  revisionNotes?: string;
  needsRevision?: boolean;
  isReadyToPost?: boolean;
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
  posted?: boolean;
  messages?: videoMessage[];
};

interface Timestamp {
  nanoseconds: number;
  seconds: number;
}

export type CompletedVideo = {
  videoNumber: string;
  payoutUSD: number;
  dateCompleted: Date;
  paid: boolean;
  paidOn: Date;
};

export type PayoutLocation = {
  type: "paypal" | "wise";
  sendTo: string;
};

export type Invoice = {
  id: string;
  date: Timestamp;
  editor: string;
  method: string;
  paid: boolean;
  total: number;
  videos: string[];
};

export type BlogPost = {
  id: string;
  title: string;
  description: string;
  content?: any; // Assuming you're using Prisma's Json type, adjust as needed
  published: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  category: string;
  tags: string[];
  image?: string;
  length: number;
  path: string;
  // Assuming there's a User type defined somewhere
  author: User;
};

type User = {
  id: string;
  name: string;
  avatar: string;
};

export const blogCategories = [
  "Tech",
  "Startups",
  "Marketing",
  "Video Content",
];
