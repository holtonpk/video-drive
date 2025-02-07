import React from "react";

const Page = () => {
  const leads = [
    {
      name: "Otter AI",
      description:
        "Get transcripts, automated summaries, action items, and chat with Otter to get answers from your meetings.",
      website: "https://otter.ai/",
      linkedIn: "https://www.linkedin.com/in/kurtapen/",
    },
    {
      name: "Otter AI",
      description:
        "Get transcripts, automated summaries, action items, and chat with Otter to get answers from your meetings.",
      website: "https://otter.ai/",
      linkedIn: "https://www.linkedin.com/in/kurtapen/",
    },
    {
      name: "Otter AI",
      description:
        "Get transcripts, automated summaries, action items, and chat with Otter to get answers from your meetings.",
      website: "https://otter.ai/",
      linkedIn: "https://www.linkedin.com/in/kurtapen/",
    },
  ];

  return (
    <div className="flex flex-col container">
      {leads.map((lead, i) => (
        <div key={i} className="border p-2 flex rounded-md items-center gap-2 ">
          <img
            src={`${lead.website}/favicon.ico`}
            className="h-10 w-10 rounded-[8px] border bg-white"
          />
          <h1 className="font-bold text-xl text-primary">{lead.name}</h1>
        </div>
      ))}
    </div>
  );
};

export default Page;
