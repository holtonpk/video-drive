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

const OfferPackages = () => {
  return (
    <Section header="Offer / Packages">
      <MarkdownRenderer markdown={OfferPackagesBody} />
    </Section>
  );
};

export default OfferPackages;

const MarkdownRenderer = ({markdown}: {markdown: string}) => {
  return (
    <div className={`${bodyFont.className} markdown-content mt-6`}>
      <ReactMarkdown
        components={{
          h1: ({children}) => <h1 className={h1Font.className}>{children}</h1>,
          h2: ({children}) => <h2 className={h2Font.className}>{children}</h2>,
          h3: ({children}) => <h3 className={h2Font.className}>{children}</h3>,
          h4: ({children}) => <h4 className={h2Font.className}>{children}</h4>,
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

const OfferPackagesBody = `
## Zing Organic Growth Strategy

We build and scale a content engine designed to bring in consistent, high-quality attention from small business owners across multiple industries.


## Offer 1: Foundation Engine

**$5,000/month**

Build an organic presence and start generating traction.

### What This Does

Establishes a consistent content system and identifies what resonates with your audience.

### What’s Included

#### Short-Form Video Content

- 30 videos per month across Instagram, TikTok, and YouTube

#### Long-Form Content: YouTube

- 4 videos per month
- Content can include education, customer stories, and product breakdowns
- Repurposed into short-form clips

#### Supporting Written Content

- 1–2 blog posts per week
- Optimized for keywords
- Ready for the website
- Repurposed and distributed across LinkedIn and Facebook with written posts

### What to Expect

- Consistent posting cadence
- Early audience growth
- Clear insight into high-performing content

### Best For

Generating an organic presence and testing the water with content.


## Offer 2: Growth Engine

**$10,500/month**

Scale reach across multiple industries and accelerate growth.

### What This Does

Expands content output and targets multiple niches simultaneously to maximize reach and discovery.

### What’s Included

#### High-Volume Short-Form Content

- 120–140 videos per month

#### Multi-Account Instagram Strategy

One main Zing account plus niche-specific satellite accounts.

Example niches:

- House painting
- Car detailing
- Fencing businesses
- House cleaning
- Home renovations

Each satellite account:

- Targets a specific audience
- Focuses on top-of-funnel, high-engagement content
- Drives traffic back to the main Zing account
- Includes subtle Zing branding across all content

#### TikTok

- All content will be posted on the main Zing TikTok account
- 120–140 videos per month

#### Long-Form Content: YouTube

- 4–6 videos per month
- Repurposed into short-form

#### Supporting Written Content

- 1–2 blog posts per week
- Optimized for keywords
- Ready for the website
- Repurposed and distributed across LinkedIn and Facebook with written posts

### What to Expect

- Significant increase in reach and impressions
- Multiple niche audiences growing in parallel
- Faster content iteration and learning

### Best For

Teams looking to aggressively grow organic acquisition.


## Offer 3: Scale Partnership

**$7,500/month**  
**6-month commitment**

Build long-term, compounding organic growth.

### What This Does

Applies the Growth Engine over a longer time horizon to maximize performance and efficiency.

### What’s Included

Everything in **Offer 2: Growth Engine**.

### Why This Works

Organic growth compounds over time. With a longer commitment, we can:

- Refine content based on real performance data
- Strengthen account authority
- Improve results and lower acquisition costs over time

### What to Expect

- Better overall ROI

### Best For

Teams committed to making organic a core growth channel.


## How to Think About These Options

- **Foundation Engine:** Build the system
- **Growth Engine:** Scale reach and output
- **Scale Partnership:** Longer commitment, better ROI
`;
