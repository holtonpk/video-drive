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
    <Section header="Summary" id="summary">
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

This strategy is designed to turn Zing’s 90 second website builder into a measurable organic acquisition channel.

Month 1 focuses on testing the strongest ways to position the website builder, while also establishing Zing’s in house content presence.

Month 2 focuses on scaling what works, continuing in house thought leadership, introducing third party UGC / creator content, and identifying which content is ready for paid amplification.

The result is a content system built around a clear business objective:

**Getting more business owners to create free websites through Zing.**

`;
