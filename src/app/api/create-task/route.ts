import {NextApiRequest, NextApiResponse} from "next";
import {NextResponse} from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const {directions, videoScript} = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `${directions} video script:${videoScript}`,
        },
      ],
      model: "gpt-4o",
    });

    return NextResponse.json({
      response: completion.choices[0].message.content,
    });
  } catch (error) {
    console.log("error =========", error);
    return NextResponse.json({
      response: "Moltar isnt working right now. Please try again later.",
    });
  }
}

export async function GET() {
  const task =
    "Mohammed and patrick should create a potential customer list tomorrow.";

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Only respond only in TaskFormat ${format} \n \n ${task} \n \n
          the current date is ${new Date().toLocaleDateString()}`,
        },
      ],
      model: "gpt-4o",
    });

    return NextResponse.json({
      response: completion.choices[0].message.content,
    });
  } catch (error) {
    console.log("error =========", error);
    return NextResponse.json({
      response: error,
    });
  }
}

const videoScript =
  "Hook: Bucket list adventures in every city - Part 1 If you live in Chicago, you have to visit The Quandary Escape Rooms. Whether you're looking for a fun date night, or a company looking for a team building event, they have a few challenging rooms that will bond you forever. If you're in the West Los Angeles area, stop by the Maze Rooms to play Area 51; a highly intricate escape room where you have to locate alien artifacts and clues exposing the truth before Area 51 in order to win. And finally, for Minneapolis residents; take your friends or family to the PuzzleWorks Escape Company for their horror themed Nightmare At the Museum game. If you are both an escape room enthusiast and a horror-fiend, then this has to be on your bucket list. Comment on your city and we will find the best adventures for you.";

const format = `
type TaskFormat = {
  id: string;
  name: string;
  dueDate: {
    nanoseconds: number;
    seconds: number;
  };
  assignee: UserId[];
  status: "todo" | "done";
  notes?: string;
  category?: keyof typeof categories;
  isWeekly?: boolean;
  dueDatesWeekly?: dueDatesWeekly[];
};

const USERS = [
  {
    name: "Patrick",
    id: "Mi4yipMXrlckU117edbYNiwrmI92",
  },
  {
    name: "Mohammed",
    id: "3tUbkjbrK9gZ86byUxpbdGsdWyj1",
  },
  {
    name: "Adam",
    id: "x9h3UepduwQHoCkwUh7bPGqEeTj2",
  },
];

type UserId = (typeof USERS)[number]["id"];


type dueDatesWeekly = {
  dueDate: {
    nanoseconds: number;
    seconds: number;
  };
  isComplete: boolean;
};

const categories = [
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
];`;

const a =
  '{\n  "id": "1",\n  "name": "Potential Customer List",\n  "dueDate": {\n    "nanoseconds": 0,\n    "seconds": 1702272000\n  },\n  "assignee": [\n    "Mi4yipMXrlckU117edbYNiwrmI92",\n    "3tUbkjbrK9gZ86byUxpbdGsdWyj1"\n  ],\n  "status": "todo",\n  "category": "acquisition"\n}\n';
