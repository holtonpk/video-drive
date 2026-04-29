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
    <Section
      header="Overview"
      children={<MarkdownRenderer markdown={OverViewBody} />}
    />
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

## What Service We Will Provide

- Creative strategy
- Production
- Posting
- Community management
- Reporting

## Strategy and Ramping

### Posting Volume

- Define how much content we will be posting each week/month
- Ramp volume based on performance and production capacity

### Platforms

- Define where we will post content
- Prioritize the platforms that best match Zing’s ICP

### Content Verticals

- Educational content
- Pain point / relatable content
- Product demo content
- UGC-style content
- Comparison content
- Lead magnet content

## Messaging Focus Along the Funnel

### Top of Funnel

Focus on awareness, education, and relatability.

- Educational value for the ICP
- Relatability with pain points
- Show common problems Zing solves
- Create content that feels helpful before it feels salesy

### Bottom of Funnel

Focus on product clarity, conversion, and trust.

- What is Zing?
- “We get your business found.”
- Affordable way to get more customers
- Fast and lightweight:
  - “You don’t have time? Good, that’s why we exist.”

## Lead Magnet

### Core Offer

**Build a website in 90 seconds, completely free.**

### Content Ideas

- UI showcase
- Build out demos
- “Are you a ___? Here’s how you can build a completely free website in 90 seconds.”
- “I own a ___ business. Here’s how I just created a brand new website in 90 seconds.”

## UGC Use

Use UGC-style content to make Zing feel simple, fast, and approachable.

### Example Angles

- “I own a ___ business, and here’s how I just created a brand new website in 90 seconds.”
- “I didn’t have time to build a website, so I used Zing.”
- “Here’s how I got my business online for free in under two minutes.”

## Product Education

### How to Use Zing

- Step-by-step walkthroughs
- Screen recordings
- Before/after examples
- Business-specific website demos

### Zing vs. Alternatives

Compare Zing against common alternatives:

- DIY website builders
- Freelancers/agencies
- Expensive website platforms
- Doing nothing / staying offline

Focus the comparison on:

- Speed
- Cost
- Ease of use
- Getting found online
- Helping small businesses get more customers`;
