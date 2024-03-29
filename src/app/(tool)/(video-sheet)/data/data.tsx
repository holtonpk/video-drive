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
    value: "todo",
    label: "Todo",
    icon: CircleIcon,
  },
  // {
  //   value: "in progress",
  //   label: "In Progress",
  //   icon: StopwatchIcon,
  // },
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
