import {NextResponse} from "next/server";

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

const ResponseFormat = {
  instagram: {
    caption: "The caption from the audio file",
    hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"],
    keywords: ["keyword1", "keyword2", "keyword3"],
    title: "The title from the audio file",
  },
  tiktok: {
    caption: "The caption from the audio file",
    hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"],
    keywords: ["keyword1", "keyword2", "keyword3"],
    title: "The title from the audio file",
  },
  youtube: {
    caption: "The caption from the audio file",
    hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"],
    keywords: ["keyword1", "keyword2", "keyword3"],
    title: "The title from the audio file",
  },
  linkedin: {
    caption: "The caption from the audio file",
    hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"],
    keywords: ["keyword1", "keyword2", "keyword3"],
    title: "The title from the audio file",
  },
  twitter: {
    caption: "The caption from the audio file",
    hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"],
    keywords: ["keyword1", "keyword2", "keyword3"],
    title: "The title from the audio file",
  },
  facebook: {
    caption: "The caption from the audio file",
    hashtags: ["#hashtag1", "#hashtag2", "#hashtag3"],
    keywords: ["keyword1", "keyword2", "keyword3"],
    title: "The title from the audio file",
  },
};

export async function POST(req: Request) {
  const {brandInfo, videoScript} = await req.json();

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://your-site.com", // Required for OpenRouter
          "X-Title": "Video Drive", // Optional, shows in billing
        },
        body: JSON.stringify({
          model: "anthropic/claude-3.7-sonnet",
          messages: [
            {
              role: "system",
              content: `**Directions
              Create social media captions for the following brand's video transcript. Captions should invite a response from the viewer. Keywords, phrases and hashtags are important and should be targeted towards the brand's audience not specific to the video script.
              Return the response as a valid JSON object matching this exact structure:
              ${JSON.stringify(ResponseFormat, null, 2)}
              
              **Brand Info
              ${brandInfo}
              
              **Video Script
              ${videoScript}`,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Clean up the response by removing markdown code block syntax
    const cleanedContent = content
      .replace(/```json\n?/g, "") // Remove opening ```json
      .replace(/```\n?/g, "") // Remove closing ```
      .trim(); // Remove any extra whitespace

    // Try to parse the content as JSON
    try {
      const parsedContent = JSON.parse(cleanedContent);
      return NextResponse.json({
        response: parsedContent,
      });
    } catch (e) {
      console.error("Failed to parse response as JSON:", e);
      console.error("Cleaned content:", cleanedContent);
      return NextResponse.json({
        response: "Error: Invalid JSON response from AI",
      });
    }
  } catch (error) {
    console.log("error =========", error);
    return NextResponse.json({
      response: "Something went wrong. Please try again later.",
    });
  }
}

export async function GET() {
  const directions =
    "Create detailed video description (instagram, tiktok, youtube style) for the following video script. use relevant keywords, phrases and hashtags";

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://your-site.com",
          "X-Title": "Video Drive",
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-sonnet",
          messages: [
            {
              role: "system",
              content: `${directions} video script:${videoScript}`,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      response: data.choices[0].message.content,
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
