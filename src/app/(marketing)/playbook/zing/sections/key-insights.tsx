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
    <Section header="Key Insights">
      <MarkdownRenderer markdown={KeyInsightsBody} />
    </Section>
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

          p: ({children}) => {
            const text = String(children).trim();

            const isImageUrl =
              text.startsWith("https://firebasestorage.googleapis.com/") &&
              /\.(png|jpg|jpeg|webp|gif)(\?|$)/i.test(text);

            if (isImageUrl) {
              return (
                <img
                  src={text}
                  alt=""
                  className="markdown-image border border-black/10 shadow-sm rounded-[16px]"
                />
              );
            }

            return <p className={bodyFont.className}>{children}</p>;
          },

          li: ({children}) => (
            <li className={bodyFont.className}>{children}</li>
          ),

          strong: ({children}) => (
            <strong className={h2Font.className}>{children}</strong>
          ),

          a: ({href, children}) => (
            <a href={href} target="_blank" rel="noreferrer">
              {children}
            </a>
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

### 1. In House Presence Drives Trust and Performance

Across top performing companies, content consistently features real team members on camera.

This builds credibility, humanizes the brand, and performs better than overly produced or faceless content.

What this looks like for Zing:

- One person from the Zing team in front of the camera
- Multiple team members giving quick takes or opinions
- Team led education, product explanations, and founder style content
- Content that feels useful, direct, and human

For this type of content we would provide detailed SOPs on how to film, scripting and video editing.

*if this is something your team isn't able to do we can sources this type of content but its raises costs and can lack customer connection.

---

### 2. One Account Cannot Effectively Target Every Audience

Trying to speak to multiple industries from a single account through organic content leads to diluted messaging and lower engagement.

Platform behavior:

- Instagram rewards specific, niche focused content
- Broader targeting can work on TikTok

So if the goal is to reach several niches through an organic strategy we recommend a satellite strategy. 

https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/zing%20playbook%20examples%2FzingInstagram.png?alt=media&token=ad0647b5-2eef-448c-b272-32ec1282be74

The alternative would be to post broader organic content consistently from one main account, while occasionally mixing in niche, targeted content.

The tradeoff is that the niche content likely would not perform as well organically because the account would not be clearly categorized around that specific audience.

That target demographic could still be reached by boosting posts to a specific audience, but at that point, it becomes more of a paid distribution strategy rather than a purely organic one.

---

### 3. Volume and Consistency Require a Structured Content System

High performing teams do not create content ad hoc. They operate from a repeatable production process that enables scale.

The most effective systems start with high-value, information dense content and then repurpose and distribute from there.

Content engine structure:

- **Blog content:** Foundation for depth, authority, and SEO
- **Long form video:** Visual, engaging delivery of core ideas on YouTube
- **Written posts:** Repurposed distribution of blog topics across LinkedIn and Facebook
- **Short form content:** Primary growth driver across Instagram, TikTok, and YouTube Shorts

Short form requires a hybrid approach.

It should be created in two ways:

- **Repurposed short form:** Clips from long form content, optimized for vertical format consumption
- **Native short form:** Content designed specifically for social platforms, usually higher engagement and more creative

https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/zing%20playbook%20examples%2FzingContent.png?alt=media&token=5a727157-bbb2-475b-95dc-5b79aded9b1b

---

## Summary of Key Insights

Effective organic strategies are focused on:

- **Human led content:** In house presence
- **Focused audience targeting:** Not one size fits all messaging
- **Scalable systems:** Structured content production
- **Multi format distribution:** Long form to short form
- **Platform native execution:** Especially for short form
`;
