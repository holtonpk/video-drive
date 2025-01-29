import React from "react";

const Compare = () => {
  const text = [
    {
      them: "Focus on views/impressions, ignore ROI.",
      us: "We focus on outcomes, not just outputs, tracking conversions and measurable results.",
    },
    {
      them: "Outsource work, causing delays and inconsistency.",
      us: "All content is created, edited, and optimized by our dedicated in-house team of experts.",
    },
    {
      them: "Use generic, data-light strategies.",
      us: "We use advanced analytics to refine our approach continuously, ensuring content is aligned with audience preferences and platform trends.",
    },
    {
      them: "Broad focus, minimal short-form expertise.",
      us: "We specialize in short-form content, with deep expertise in trends, formats, and audience behavior specific to platforms like TikTok, Instagram, and YouTube Shorts.",
    },
    {
      them: "Infrequent reports, slow client responses.",
      us: "We provide weekly reports to keep you updated, with a monthly call to discuss performance and plan for the next month’s strategy. We also offer a 24/7 active Slack channel for urgent needs.",
    },
  ];

  return (
    <div id="compare" className="container pt-20">
      <h1 className="text-4xl font1-bold text-center mb-8">
        Other Agencies vs. <span className="text-[#34F4AF]">Ripple Media</span>
      </h1>
      <div className="w-full border rounded-xl overflow-hidden grid grid-cols-[40%_1fr]  divide-x divide-y bg-black/10">
        <h1 className="p-4 text-xl md:text-2xl font1-bold bg-black/30 blurBack">
          What they do
        </h1>
        <h1 className="p-4 text-xl md:text-2xl font1-bold bg-[#34F4AF] text-background">
          What Ripple Media does{" "}
        </h1>

        {text.map((el, i) => (
          <>
            <div className="h-fit items-center flex w-full relative ">
              <p
                lang="en"
                className="text-md md:text-xl p-2 md:p-4 hyphenate  w-full"
              >
                {el.them}
              </p>
            </div>
            <p className="p-2 md:p-4 text-md md:text-xl">{el.us}</p>
          </>
        ))}
      </div>
    </div>
  );
};

export default Compare;
