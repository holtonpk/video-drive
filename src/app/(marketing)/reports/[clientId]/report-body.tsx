import React from "react";
import ReactMarkdown from "react-markdown";
import "./report-style.css";

const ReportBody = () => {
  return (
    <div id="report" className="bg-white/5 p-4 rounded-md">
      <ReactMarkdown>{reportBody}</ReactMarkdown>
    </div>
  );
};

export default ReportBody;

const reportBody = `## Content Performance & Strategy Update

- **TikTok**: Seeing great engagement with the *Crazy Story* series, especially on TikTok.
- **Interview Clips**: Continuing to test different animation styles and hook strategies.
- **Blue Collar Bloopers / Memes**: Strong performance in terms of views and shares.
- **LinkedIn & Twitter**: Growth has been slow. These platforms favor written content, so a new series tailored for that format will be launched.
- **Facebook**: Growth is currently slow. We anticipate improvement as Instagram picks up. If not, we’ll consider launching a new series specifically optimized for Facebook.
`;
