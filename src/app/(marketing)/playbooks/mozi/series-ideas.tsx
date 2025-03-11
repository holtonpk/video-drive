"use client";

import {Lightbulb} from "lucide-react";
import {useState} from "react";
import {Icons} from "@/components/icons";

export const SeriesIdeas = () => {
  const [selectedSeries, setSelectedSeries] = useState<number | undefined>(1);

  const series = [
    {
      id: 1,
      title: "Emotionally Engaging Content",
      description: [
        "High-impact, thought-provoking content that speaks to the challenges of modern social life and the importance of real-world connections.",
        "Podcast clips - Bite-sized takeaways from conversations on modern social dynamics, emphasizing the power of real-life connections over digital interactions",
        "Scroll-Stopping Content - Short, compelling videos that immediately capture attention and encourage engagement.",
        "Core Messaging Themes: Your Follower Count Doesn’t Matter—Your Real Friends Do. More Social, Less Media. In-Person > Online. Stop Wasting Time Scrolling—Start Living.",
        "Collaborative Content – Partnerships with creators, influencers, and brands that align with Mozi’s vision.",
      ],
    },
    {
      id: 2,
      title: "Authentic UGC",
      description: [
        "Encouraging real users to share their spontaneous Mozi experiences, building credibility and community-driven momentum.",
        "Travel & social content - Highlighting how Mozi enhances local and travel-based social interactions, making it effortless to stay connected wherever you are.",
        "Interactive Challenges – Encouraging users to create and share their own Mozi plans, driving organic engagement and peer-to-peer growth.",
        "Collaborative content - Partnerships with creators, influencers, and brands that align with Mozi’s vision.",
      ],
    },
    {
      id: 3,
      title: "Educational & Product-Focused Content",
      description: [
        "“How Mozi Works” Series – Quick, informative videos demonstrating the app’s key features and benefits.",
        "Behind-the-Scenes Content – Providing a look at Mozi’s evolution, updates, and the team behind it to build deeper brand loyalty.",
      ],
    },
    {
      id: 4,
      title: "Viral & Cultural Content",
      description: [
        "Memes & Humor – Relatable, engaging content that highlights social challenges (e.g., flaky friends, FOMO, digital fatigue) and how Mozi solves them.",
        "Trend-Integrated Content – Leveraging viral trends, pop culture moments, and internet humor to maximize reach and engagement.",
      ],
    },
  ];

  return (
    <div className="flex gap-2 flex-col w-full">
      <h2 className="text-2xl font-bold mt-10 flex items-center gap-2 text-[#FF5501]">
        <Lightbulb className="w-5 h-5" />
        Short Form Series Concepts
      </h2>
      <div className="grid  max-w-[1000px] gap-4">
        <div className=" flex flex-col gap-2 rounded-md h-fit border-black/10  order-2 md:order-1">
          {series.map((series) => {
            return (
              <button
                key={series.id}
                className={`flex flex-col gap-2 border text-left p-2 px-4 bg-white rounded-md  shadow-md group transition-all duration-300 ${
                  selectedSeries === series.id
                    ? "border-[#FF5501] "
                    : " border-black/10 hover:border-[#FF5501]/50"
                }`}
                onClick={() =>
                  setSelectedSeries(
                    selectedSeries === series.id ? undefined : series.id
                  )
                }
              >
                <div className="flex items-center text-black justify-between mt-2">
                  {series.title}
                  <Icons.chevronDown
                    className={`w-4 h-4 ml-auto  text-[#FF5501]
                      ${
                        selectedSeries === series.id
                          ? "block rotate-180"
                          : "hidden group-hover:block "
                      }
                    `}
                  />
                </div>
                <div
                  className={`grid transition-all  duration-300 ${
                    selectedSeries === series.id
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm text-black/50 flex flex-col gap-2">
                      {series.description.map((description) => (
                        <p key={description}>• {description}</p>
                      ))}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <span className="text-center text-black/70">
        *These are all just starting points.
      </span>
    </div>
  );
};

// Emotionally Engaging Content - High-impact, thought-provoking content that speaks to the challenges of modern social life and the importance of real-world connections.
// Podcast clips - Bite-sized takeaways from conversations on modern social dynamics, emphasizing the power of real-life connections over digital interactions.
// Scroll-Stopping Content - Short, compelling videos that immediately capture attention and encourage engagement.
// Core Messaging Themes:
// “Your Follower Count Doesn’t Matter—Your Real Friends Do.”
// “More Social, Less Media.”
// “In-Person > Online.”
// “Stop Wasting Time Scrolling—Start Living.”
// Collaborative Content – Partnerships with creators, influencers, and brands that align with Mozi’s vision.

// Authentic UGC - Encouraging real users to share their spontaneous Mozi experiences, building credibility and community-driven momentum.
// Travel & social content - Highlighting how Mozi enhances local and travel-based social interactions, making it effortless to stay connected wherever you are.
// Interactive Challenges – Encouraging users to create and share their own Mozi plans, driving organic engagement and peer-to-peer growth.
// Collaborative content - Partnerships with creators, influencers, and brands that align with Mozi’s vision.

// Educational & Product-Focused Content
// “How Mozi Works” Series – Quick, informative videos demonstrating the app’s key features and benefits.
// Behind-the-Scenes Content – Providing a look at Mozi’s evolution, updates, and the team behind it to build deeper brand loyalty.

// Viral & Cultural Content
// Memes & Humor – Relatable, engaging content that highlights social challenges (e.g., flaky friends, FOMO, digital fatigue) and how Mozi solves them.
// Trend-Integrated Content – Leveraging viral trends, pop culture moments, and internet humor to maximize reach and engagement.
