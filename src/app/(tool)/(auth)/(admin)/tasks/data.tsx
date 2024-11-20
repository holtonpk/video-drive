import {CheckCircle, Circle, CircleOff, HelpCircle, Timer} from "lucide-react";

import {OutputData} from "@editorjs/editorjs";
import {Timestamp} from "firebase/firestore";

export const USERS = [
  "Mi4yipMXrlckU117edbYNiwrmI92",
  "3tUbkjbrK9gZ86byUxpbdGsdWyj1",
  "x9h3UepduwQHoCkwUh7bPGqEeTj2",
];

export type Task = {
  id: string;
  name: string;
  dueDate: Timestamp;
  assignee: string[];
  status: "todo" | "done";
  notes?: OutputData | string;
  category?: string;
};

export type Status = {
  value: string;
  label: string;
  icon: React.ReactNode;
};

export const statuses: Status[] = [
  {
    value: "todo",
    label: "Todo",
    icon: <Circle className="h-4 w-4 text-blue-600" />,
  },

  {
    value: "done",
    label: "Done",
    icon: <CheckCircle className="h-4 w-4 text-green-600" />,
  },
];

export const categories = [
  {
    label: "🎯 Acquisition",
    value: "acquisition",
  },
  {
    label: "🎨 Branding",
    value: "branding",
  },
  {
    label: "💰 Finance",
    value: "finance",
  },
  {
    label: "👥 Client management",
    value: "client-management",
  },
  {
    label: "📹 Videos",
    value: "videos",
  },
  {
    label: "💡 Strategy",
    value: "strategy",
  },
  {
    label: "🛠️ Tools",
    value: "tools-technology",
  },
];
