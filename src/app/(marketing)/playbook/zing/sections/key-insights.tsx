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

const KeyInsights = () => {
  return (
    <Section
      header="Key Insights"
      children={<MarkdownRenderer markdown={KeyInsightsBody} />}
    />
  );
};

export default KeyInsights;

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

const KeyInsightsBody = `
## Key Insights from Competitor & Market Analysis

### 1. In-House Presence Drives Trust and Performance

Across top-performing companies, content consistently features real team members on camera.

This builds credibility, humanizes the brand, and performs better than overly produced or faceless content.

What this looks like for Zing:

- One person from the Zing team in front of the camera
- Multiple team members giving quick takes or opinions
- Team-led education, product explanations, and founder-style content
- Content that feels useful, direct, and human

---

### 2. One Account Cannot Effectively Target Every Audience

Trying to speak to multiple industries from a single account leads to diluted messaging and lower engagement.

Platform behavior:

- Instagram rewards specific, niche-focused content
- Broader targeting can work on TikTok
- Instagram usually requires more precision and clearer audience signals

This creates an opportunity for a multi-account satellite strategy to reach different audiences more effectively.

More on this later in the niche and satellite account strategy.

---

### 3. Volume and Consistency Require a Structured Content System

High-performing teams do not create content ad hoc. They operate from a repeatable production process that enables scale.

The most effective systems start with high-value, information-dense content and then repurpose and distribute from there.

Content engine structure:

- **Blog content:** Foundation for depth, authority, and SEO
- **Long-form video:** Visual, engaging delivery of core ideas on YouTube
- **Written posts:** Repurposed distribution of blog topics across LinkedIn and Facebook
- **Short-form content:** Primary growth driver across Instagram, TikTok, and YouTube Shorts

Short-form requires a hybrid approach.

It should be created in two ways:

- **Repurposed short-form:** Clips from long-form content, optimized for vertical format consumption
- **Native short-form:** Content designed specifically for social platforms, usually higher engagement and more creative

---

## Summary of Key Insights

Effective organic strategies are focused on:

- **Human-led content:** In-house presence
- **Focused audience targeting:** Not one-size-fits-all messaging
- **Scalable systems:** Structured content production
- **Multi-format distribution:** Long-form to short-form
- **Platform-native execution:** Especially for short-form
`;
