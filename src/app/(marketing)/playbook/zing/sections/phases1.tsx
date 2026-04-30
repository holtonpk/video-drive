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
    <Section header="Phase 1">
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
## Phase 1: Month 1 — Lead Magnet Testing Sprint

### Objective

Identify the strongest messaging, hooks, formats, and creative angles for getting business owners to create a free website using Zing’s 90 second website builder.

Month 1 is focused on building the foundation, testing creative direction, and establishing the internal content production process.

## Deliverables

### 1. Short Form Lead Magnet Content

**30 short form videos per month**

These videos will focus on testing different ways to position the 90 second website builder.

Content will test multiple creative angles, including:

- Product led website builder demos
- Niche specific website build outs
- In house team led website builder explainers
- Pain first hooks around not having a website
- Before / after website transformations


### Primary Distribution

- Instagram Reels
- TikTok
- YouTube Shorts

### Primary CTA

**Create your free website in 90 seconds.**

---

### 2. In House Team Thought Leadership Content

**8 short form videos per month**

These videos will feature Zing team members on camera to build trust, credibility, and authority with small business owners.

Content topics may include:

- What every service business website needs
- Why relying only on Facebook or Instagram is not enough
- Common reasons local businesses lose leads online
- How business owners can improve local visibility
- Why online booking and lead capture matter
- How Zing helps businesses get online faster

### Ripple Will Provide

- Filming SOP
- Scripts / talking points
- Content direction
- Editing
- Captions and visual enhancements

---

### 3. Blog Content Supporting the Lead Magnet

**4 blog posts per month**

Blog content will support SEO, authority, and lead magnet conversion.

The blog strategy will focus on creating information rich content around topics that small business owners are actively searching for. This includes SEO opportunities around keywords related to free website building, small business website creation, and online visibility.

We will conduct keyword research to identify winnable areas and optimize content for discoverability.

Potential topics may include:

- How to create a website for your small business
- What every local business website needs in 2026
- Why your business needs more than a Facebook page
- How to get more local customers online
- How online booking helps service businesses grow

Each blog will include natural calls to action driving readers toward the 90 second website builder.

---

### 4. LinkedIn and Facebook Repurposing

**Written posts repurposed from blog and thought leadership content**

Blog content and in house videos will be repurposed into written posts for LinkedIn and Facebook.

These posts will be used to:

- Make long form topics more digestible
- Test written messaging around the lead magnet
- Build credibility with small business owners
- Drive attention back to the website builder

---

### 5. UGC / Influencer Pipeline Development

During Month 1, we will begin building a list of relevant creators and business owners who can support UGC and influencer content in Month 2.

The focus will be on finding:

- Creators who speak to contractors, trades, beauty, fitness, and home service audiences
- UGC creators who can credibly represent the experience of building a website for their business
- Business owners who can build in public and co post with Zing

This prepares Zing to introduce more third party, relatable content in Month 2 while also helping us gauge creator availability, willingness, and pricing for collaborations.

### Key Insight

You mentioned on the call that we should try to find businesses that are active on socials, using car detailers as an example. After finding these companies, we would reach out, pitch them to use the website builder, and have them post the results.

After researching this strategy, we identified two problems:

1. About 95% of companies that are active on social already have a functional website.
2. Even if they did use the website builder and posted the result, their audience would mostly be made up of their customers, not Zing’s target demo.

So the key for UGC / influencer content is identifying creators who speak to business owners, or finding business owners who will build in public and co post with Zing.

This is why we will need time to identify these opportunities.


`;
