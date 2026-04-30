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
    <Section header="Phase 2">
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

## Phase 2: Month 2 — Start to Scale What Works

### Objective

Use Month 1 performance data to identify winning messaging and creative formats, then scale the content most likely to drive free website creations.

Month 2 shifts from broad testing to focused iteration, while continuing to build Zing’s in house authority and trust with business owners.

## Deliverables

### 1. Data Led Creative Iteration

At the start of Month 2, we will review Month 1 performance to identify:

- Best performing hooks
- Best performing content formats
- Best performing niche angles
- Highest click through CTAs
- Strongest conversion paths into the website builder

From there, we will build new content around proven winners instead of guessing.

---

### 2. Continued Short Form Lead Magnet Content

**30+ short form videos per month**

Content will continue to focus on the 90 second website builder, but with more emphasis on the formats that showed the strongest signal in Month 1.

Examples may include:

- More niche specific website builds
- More winning hook variations
- More product demos based on the highest performing style
- More UGC style content
- More direct CTA testing
- More before / after transformations
- More content built around the strongest performing niches

---

### 3. Continued In House Thought Leadership Content

**8 short form videos per month**

Zing’s in house content initiative will continue in Month 2, with a stronger focus on the topics, formats, and messaging that performed best during Month 1.

These videos will continue to feature Zing team members on camera, helping build trust, authority, and familiarity with business owners.

Content may include:

- Practical advice for getting more customers online
- Website, SEO, and local visibility education
- Common mistakes small businesses make with their online presence
- Breakdowns of what makes a website convert
- Commentary on trends affecting service based businesses
- Direct responses to questions or objections from the audience

In Month 2, this content becomes more data led. We will use Month 1 performance to identify which team members, topics, hooks, and delivery styles generate the strongest engagement and continue building from there.

### Ripple Will Continue to Provide

- Scripts / talking points
- Filming guidance
- Content direction
- Editing
- Captions and visual enhancements

---

### 4. UGC / Creator Content Activation

Month 2 introduces external voices to make the website builder feel more relatable and trusted.

UGC content may include:

- “I built a website for my business in 90 seconds”
- “Testing Zing’s free website builder”
- “Here’s what my business website could look like”
- “I didn’t realize how easy this was”
- Business-owner POV content

This helps Zing move beyond brand led messaging and into more authentic third party content.

---

### 5. Paid Amplification Recommendation

Once organic content shows early traction, paid spend can be introduced to scale the strongest creative.

The approach:

**Organic identifies the winners. Paid scales the winners.**

Instead of putting budget behind untested ads, we recommend amplifying content that has already shown strong performance organically.

Paid amplification can be used to target:

- Service business owners
- Local business operators
- Specific verticals showing strong response
- Retargeting audiences who engaged with content or visited the website builder page

This creates a more efficient path to paid growth because the creative has already been validated through organic performance.

`;
