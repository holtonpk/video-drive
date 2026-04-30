import React from "react";
import localFont from "next/font/local";
import ReactMarkdown from "react-markdown";
import {Section} from "../section";
import "../markdown.css";

const h1Font = localFont({
  src: "../../fonts/HeadingNow-56Bold.ttf",
});

const bodyFont = localFont({
  src: "../../fonts/proximanova_regular.ttf",
});

const h2Font = localFont({
  src: "../../fonts/proximanova_bold.otf",
});
const ContentTypes = () => {
  return (
    <Section header="Measurement and Success">
      <MarkdownRenderer markdown={OverViewBody} />
    </Section>
  );
};

export default ContentTypes;

const MarkdownRenderer = ({markdown}: {markdown: string}) => {
  return (
    <div className={`${bodyFont.className} markdown-content mt-4`}>
      <ReactMarkdown
        components={{
          h1: ({children}) => <h1 className={h1Font.className}>{children}</h1>,
          h2: ({children}) => <h2 className={h2Font.className}>{children}</h2>,
          h3: ({children}) => <h3 className={h2Font.className}>{children}</h3>,
          p: ({children}) => <p className={bodyFont.className}>{children}</p>,
          li: ({children}) => (
            <li className={bodyFont.className}>{children}</li>
          ),
          strong: ({children}) => (
            <strong className={h2Font.className}>{children}</strong>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

const OverViewBody = `

The primary measure of success is:

**Free websites created through Zing’s 90 second website builder.**

Supporting metrics may include:

- Video views
- Watch time / retention
- Engagement rate
- Profile visits
- CTR
- Website builder landing page visits
- Free website creation conversion rate
- Qualified leads generated

The goal is to connect organic content performance directly to lead generation and customer acquisition. We will be tracking all available data across social platforms.


`;
