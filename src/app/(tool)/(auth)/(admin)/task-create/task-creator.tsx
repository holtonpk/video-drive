import React from "react";
import {OutputData} from "@editorjs/editorjs";

const TaskCreator = () => {
  const createTask = async () => {
    const response = await fetch("/api/create-task", {
      method: "POST",
      body: JSON.stringify({
        directions: prompt,
      }),
    });
    const data = await response.json();
  };

  return <div>TaskCreator</div>;
};

export default TaskCreator;

export type Task = {
  id: string;
  name: string;
  dueDate: {
    nanoseconds: number;
    seconds: number;
  };
  assignee: string[];
  status: "todo" | "done";
  notes?: string;
  category?: keyof typeof categories;
  isWeekly?: boolean;
  dueDatesWeekly?: dueDatesWeekly[];
};

type dueDatesWeekly = {
  dueDate: {
    nanoseconds: number;
    seconds: number;
  };
  isComplete: boolean;
};

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
