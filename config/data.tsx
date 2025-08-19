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
  ScamRxLogo,
  FaceBookLogo,
  LinkedInLogo,
  XLogo,
} from "@/components/icons";
import {Icons} from "@/components/icons";
import {OutputData} from "@editorjs/editorjs";
import {Pencil, Circle, CircleCheckBig, CircleX} from "lucide-react";

export const ADMIN_USERS = [
  "Mi4yipMXrlckU117edbYNiwrmI92",
  "3tUbkjbrK9gZ86byUxpbdGsdWyj1",
  "x9h3UepduwQHoCkwUh7bPGqEeTj2",

  "y9VhFCzIuRW33vjKhmVrpqH4ajx2",
];

export const EDITOR_USERS = [
  "y9VhFCzIuRW33vjKhmVrpqH4ajx2",
  "Mi4yipMXrlckU117edbYNiwrmI92",
  "3tUbkjbrK9gZ86byUxpbdGsdWyj1",
  "x9h3UepduwQHoCkwUh7bPGqEeTj2",
];

export const MANAGER_USERS = [
  "y9VhFCzIuRW33vjKhmVrpqH4ajx2",
  "Mi4yipMXrlckU117edbYNiwrmI92",
  "3tUbkjbrK9gZ86byUxpbdGsdWyj1",
  "x9h3UepduwQHoCkwUh7bPGqEeTj2",
];

export const EDITORS = [
  // "orxFlEC5v8euefk1OSJVTVXgilE2",
  {
    id: "y9VhFCzIuRW33vjKhmVrpqH4ajx2",
    clients: ["morty", "blueCollarKeys"],
  },
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

export const MANAGERS = [
  // "orxFlEC5v8euefk1OSJVTVXgilE2",
  {
    id: "y9VhFCzIuRW33vjKhmVrpqH4ajx2",
    clients: ["morty", "blueCollarKeys"],
  },
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
  {
    id: "x9h3UepduwQHoCkwUh7bPGqEeTj2",
    clients: ["scam_rx"],
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
    brandInfo: "",
  },
  {
    id: "2",
    value: "morty",
    label: "Morty",
    icon: MortyLogo,
    description: "Blaze is a company that sells candles.",
    brandInfo: `
Here is some information about Morty app:
About Morty
Morty is a free app to find, track, and review every immersive attraction on earth.
 
 
Our mission
Building “the biggest theme park in the universe”
In recent years, the technology to create Disney Imagineering-caliber immersive attractions has been democratized. Creative individuals have been empowered and are  building mind-blowing experiences in strip malls and warehouses around the world.
Morty unifies this new global theme park, and gets people together, reducing collective loneliness. Come join our quest! 
`,
  },
  {
    id: "3",
    value: "founderCentral",
    label: "Founder Central",
    icon: FcLogo,
    description:
      "Viral Factory create viral short video that are perfect for social media.",
    brandInfo: "",
  },
  {
    id: "6",
    value: "blueCollarKeys",
    label: "Blue Collar Keys",
    icon: BlueCollarKeysLogo,
    description: "Blue Collar Keys is a company that sells keys.",
    brandInfo: `
Here is some information about blue collar keys:

Hey, we see you—the ones who build, fix, and power America.

At Blue Collar Keys, we want to tell your stories, loud and proud because you deserve to be heard, recognized, and celebrated. Welcome to a community that finally puts you in the spotlight.


Blue collar workers have stayed in the background, even though you're the ones keeping America running. This is what lead us to creating Blue Collar Keys. We want to fundamentally change that.

We want to help tell your story—unfiltered, unapologetic, and on your own terms. This is more than a brand to us; it's a movement. We want to give you a platform to showcase your work, expertise, and pride in a job well done. Whether you're a technician, plumber, electrician, roofer, or builder, we see you, and we've got your back.

Join us to celebrate the backbone of this amazing country and let the world know how vital your hands really are.


**What is Blue Collar Keys?**

You're like me, skipping straight to the point. We're here to spotlight the skilled hands that build, fix, and keep America running. Your work matters, and your story deserves to be told **your way**.

**Who is this for?**

If you work with your hands—plumbers, electricians, mechanics, welders, HVAC techs, truckers, builders, and more—this is for **you**. If you own a business and have key employees who deserve recognition, we want to hear about them too. **We're starting a movement here.**

**Why does this matter?**

Because blue-collar workers **don't** get the recognition they deserve. The world runs on your skills, but too often, the spotlight is elsewhere. **We're gonna to change that.**

**How can I share my story?**

Super easy. Reach out to us below, and we'll work with you to highlight your journey—whether that's through a short interview, a feature story, or just a simple shoutout. **You've got a story worth telling. Let's tell it right.**

**How can I get involved?**

Follow us, share your story, tag someone who deserves the spotlight, or just spread the word. The more people who see and support this, the bigger the movement grows. **And yeah, make sure you grab some swag.**
`,
  },
  // {
  //   id: "4",
  //   value: "learnXYZ",
  //   label: "Learn XYZ",
  //   icon: LearnXYZLogo,
  //   description: "Explore bite-sized Learning with the magic of AI",
  //   brandInfo: "",
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
  // {
  //   id: "8",
  //   value: "test_client",
  //   label: "Test Client",
  //   icon: FrizzleLogo,
  //   description:
  //     "Turn anything into a presentation. Frizzle AI is a presentation tool that uses AI to turn your ideas into beautiful slides.",
  // },
  {
    id: "9",
    value: "scam_rx",
    label: "Scam Rx",
    icon: ScamRxLogo,
    description: "Educate yourself about scams and protect yourself from them.",
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

export type PlatformData = {
  label: string;
  value: Platform;
  icon: React.ComponentType<{className?: string}>;
};

export const platforms: PlatformData[] = [
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
  {
    label: "Facebook",
    value: "facebook",
    icon: FaceBookLogo,
  },
  {
    label: "Linkedin",
    value: "linkedin",
    icon: LinkedInLogo,
  },
  {
    label: "Twitter",
    value: "twitter",
    icon: XLogo,
  },
];

export type VideoAsset = {
  title: string;
  url: string;
};

type status = {
  value: string;
  label: string;
  icon: React.ComponentType<{className?: string}>;
};

export type Platforms = "youtube" | "instagram" | "tiktok" | "all";

export type ClientVideoData = {
  videoNumber: string;
  title: string;
  videoURL?: string;
  postDate: Timestamp;
  hasAccess: boolean;
  views: number;
  likes: number;
  comments: number;
  tiktok?: SocialLink;
  instagram?: SocialLink;
  facebook?: SocialLink;
  x?: SocialLink;
  linkedin?: SocialLink;
  youtube?: SocialLink;
  thumbnail: string;
};

type SocialLink = {
  id: string;
  link: string;
};

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
  captions?: ResponseFormatType;
  scrapedVideoText?: string;
};

export type Platform =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "linkedin"
  | "twitter"
  | "facebook";

export type ResponseFormatType = {
  [key in Platform]: {
    caption: string;
    hashtags: string[];
    keywords: string[];
    title: string;
  };
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
  assets?: VideoAsset[];
  voiceOver?: VideoAsset[];
  notes?: string;
  // script: ScriptData | string;
  script?: OutputData | string;
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
  files?: AssetFile[];
  manager?: string;
  scrapedVideoText?: string;
  thumbnail?: string;
  postData?: PostData[];
};

type PostData = {
  platform: Platform;
  icon: typeof Icons;
  isPosted: boolean;
  postDate: Timestamp;
};

// const PostData = {
//   instagram:{
//     icon: InstagramLogo,
//     isPosted: boolean;
//     postDate: Timestamp;
//   },
//   tiktok:{
//     icon: TiktokLogo,
//     isPosted: boolean;
//     postDate: Timestamp;
//   },
//   youtube:{
//     icon: YoutubeLogo,
//     isPosted: boolean;
//     postDate: Timestamp;
//   },
//   facebook:{
//     icon: FaceBookLogo,
//     isPosted: boolean;
//     postDate: Timestamp;
//   },
//   linkedin:{
//     icon: LinkedInLogo,
//     isPosted: boolean;
//     postDate: Timestamp;
//   },
//   twitter:{
//     icon: XLogo,
//     isPosted: boolean;
//     postDate: Timestamp;
//   },
// };

export type AssetFile = {
  id: string;
  uploadedAt: Timestamp;
  uploadedBy: string;
  title: string;
  videoURL: string;
  type: "img" | "video";
  notes?: string;
  chat?: Chat[];
};

export type Chat = {
  id: string;
  message: string;
  senderId: string;
  timestamp: Timestamp;
  viewedBy: string[];
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
  size?: number;
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

export interface Timestamp {
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
