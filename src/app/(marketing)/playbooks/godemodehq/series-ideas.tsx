"use client";

import {Lightbulb} from "lucide-react";
import {useState} from "react";
import {Icons} from "@/components/icons";

export const SeriesIdeas = () => {
  const [selectedSeries, setSelectedSeries] = useState<number | undefined>(1);

  const series = [
    {
      id: 1,
      title: "Crazy sales strategy (TOF)",
      description: [
        "In this series, we’ll stories of out-of-the-box sales strategies that startups and founders have used. These outrageous stories are naturally attention grabbing so they’ll make the perfect hook. We then end every video with a relevant CTA that ties that specific story to a unique value proposition of Godmode HQ",
        "Branded as GodMode (look and voice)",
      ],
    },
    {
      id: 2,
      title: "Godmode educational (BOF)",
      description: [
        "This series will provide actionable tips and advice for businesses covering how to make the most of Godmode’s platform, showcasing the features that help you find the leads and then turn them into customers. For businesses on the verge of making a decision, this content provides the final push they need. It’s practical, to the point, and shows exactly how Godmode will solve their pain points.",
      ],
    },
    {
      id: 3,
      title: "Day in the life (BOF)",
      description: [
        "Here we are taking the lessons we get from the TOF memes and bring them to life with engaging stories showcasing a day in the life of a typical sales rep or team. Episodes will cover the different aspects of the job, from cold outreach struggles to follow-up fatigue and even contrasting the old-school and manual approach with the efficiency of AI-powered outreach. Sales teams will see themselves in these relatable (and slightly exaggerated) scenarios, making the content highly engaging and shareable.",
      ],
    },
    {
      id: 4,
      title: "How to sell (TOF)",
      description: [
        "We’ll curate short, practical tips from well-known founders or sales experts, highlighting their insights on cold outreach, customer engagement, and conversion strategies. The familiar faces coupled with us subtly integrating how Godmode can elevate these tactics even further, will position it as an essential tool for the modern day sales team.",
      ],
    },
  ];

  return (
    <div className="flex gap-2 flex-col w-full">
      <h2 className="text-2xl font-bold mt-10 flex items-center gap-2 text-[#34F4AF]">
        <Lightbulb className="w-5 h-5" />
        Short Form Series Ideas
      </h2>
      <div className="grid  max-w-[1000px] gap-4">
        <div className=" flex flex-col gap-2 rounded-md h-fit border-white/10 order-2 md:order-1">
          {series.map((series) => {
            return (
              <button
                key={series.id}
                className={`flex flex-col gap-2 border text-left p-2 px-4 rounded-md group transition-all duration-300 ${
                  selectedSeries === series.id
                    ? "border-[#34F4AF] "
                    : " border-white/10 hover:border-[#34F4AF]/50"
                }`}
                onClick={() =>
                  setSelectedSeries(
                    selectedSeries === series.id ? undefined : series.id
                  )
                }
              >
                <div className="flex items-center justify-between mt-2">
                  {series.title}
                  <Icons.chevronDown
                    className={`w-4 h-4 ml-auto   
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
                    <p className="text-sm text-white/50">
                      {series.description.map((description) => (
                        <p key={description}>- {description}</p>
                      ))}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <span className="text-center text-[#34F4AF]/70">
        *These are all just starting points.
      </span>
    </div>
  );
};
