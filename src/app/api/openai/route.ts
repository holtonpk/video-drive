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
  const directions =
    "Create detailed video description (instagram, tiktok, youtube style) for the following video script. use relevant keywords, phrases and hashtags";

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
      response: error,
    });
  }
}

const videoScript =
  "Hook: Bucket list adventures in every city - Part 1 If you live in Chicago, you have to visit The Quandary Escape Rooms. Whether you're looking for a fun date night, or a company looking for a team building event, they have a few challenging rooms that will bond you forever. If you're in the West Los Angeles area, stop by the Maze Rooms to play Area 51; a highly intricate escape room where you have to locate alien artifacts and clues exposing the truth before Area 51 in order to win. And finally, for Minneapolis residents; take your friends or family to the PuzzleWorks Escape Company for their horror themed Nightmare At the Museum game. If you are both an escape room enthusiast and a horror-fiend, then this has to be on your bucket list. Comment on your city and we will find the best adventures for you.";
