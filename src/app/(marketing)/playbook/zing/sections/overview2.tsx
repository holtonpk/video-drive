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
    <Section header="Plan 2 Overview" id="overview2">
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

The primary goal of this strategy is to use organic content to drive business owners to create a free website through Zing’s 90-second website builder.

After our conversation, it is clear that the website builder should be the central focus of Zing’s organic content. Rather than creating content for awareness alone, the content system will be built around one primary action:

**Getting business owners to create a free website through Zing.**

Success will be measured by the ability to move business owners through the following path:

**Content engagement → website builder landing page → free website creation → qualified lead**

To accomplish this, we need to identify the strongest messaging, hooks, formats, and creative angles for getting business owners to take action.

## Strategy Phases

The strategy is structured across two phases:

### Phase 1: Test

Build the foundation, test creative direction, and establish the in house content production process.

### Phase 2: Scale

Use performance data to double down on winning formats, continue Zing’s in-house thought leadership content, introduce UGC / creator content, and begin paid amplification on content validated through organic traction.

`;
