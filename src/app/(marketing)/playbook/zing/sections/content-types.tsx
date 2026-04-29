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
    <>
      <Section header="Content Types">
        <div className="flex w-full flex-col">
          <MarkdownRenderer markdown={ContentTypesIntro} />
        </div>
      </Section>
      {CONTENT_TYPE_SECTIONS.map((section) => (
        <Section
          className="mt-8"
          isSub
          id={section.id}
          key={section.id}
          header={section.label}
        >
          <MarkdownRenderer markdown={section.markdown} />
        </Section>
      ))}
    </>
  );
};

export default ContentTypes;

const MarkdownRenderer = ({markdown}: {markdown: string}) => {
  const parts = parseMarkdownWithVideos(markdown);

  return (
    <div className={`${bodyFont.className} markdown-content mt-6`}>
      {parts.map((part, index) => {
        if (part.type === "videos") {
          return (
            <div key={index} className="video-example-grid">
              {part.videos.map((video, videoIndex) => (
                <div
                  key={`${video.url}-${videoIndex}`}
                  className="video-example-card"
                >
                  <div className="video-example-frame">
                    <video
                      src={video.url}
                      controls
                      playsInline
                      preload="metadata"
                      className="video-example"
                    />
                  </div>

                  <p className={`${bodyFont.className} video-example-label`}>
                    {video.label}
                  </p>
                </div>
              ))}
            </div>
          );
        }

        return (
          <ReactMarkdown
            key={index}
            components={{
              h1: ({children}) => (
                <h1 className={h1Font.className}>{children}</h1>
              ),
              h2: ({children}) => (
                <h2 className={h2Font.className}>{children}</h2>
              ),
              h3: ({children}) => (
                <h3 className={h2Font.className}>{children}</h3>
              ),
              p: ({children}) => (
                <p className={bodyFont.className}>{children}</p>
              ),
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
            {part.content}
          </ReactMarkdown>
        );
      })}
    </div>
  );
};

type MarkdownPart =
  | {
      type: "markdown";
      content: string;
    }
  | {
      type: "videos";
      videos: {
        label: string;
        url: string;
      }[];
    };

const parseMarkdownWithVideos = (markdown: string): MarkdownPart[] => {
  const parts: MarkdownPart[] = [];
  const videoBlockRegex = /::videos\s*([\s\S]*?)\s*::/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = videoBlockRegex.exec(markdown)) !== null) {
    const markdownBefore = markdown.slice(lastIndex, match.index).trim();

    if (markdownBefore) {
      parts.push({
        type: "markdown",
        content: markdownBefore,
      });
    }

    const videoBlock = match[1];

    const videos = Array.from(
      videoBlock.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g),
    ).map((videoMatch) => ({
      label: videoMatch[1],
      url: videoMatch[2],
    }));

    if (videos.length > 0) {
      parts.push({
        type: "videos",
        videos,
      });
    }

    lastIndex = match.index + match[0].length;
  }

  const markdownAfter = markdown.slice(lastIndex).trim();

  if (markdownAfter) {
    parts.push({
      type: "markdown",
      content: markdownAfter,
    });
  }

  return parts;
};

const ContentTypesIntro = `
These are the pillars that will guide the content we create.

The content within each pillar needs:

- Strong hooks
- Fast paced
- Clear value in under 10 seconds

---

`;

const CONTENT_TYPE_SECTIONS = [
  {
    id: "credibility-building",
    label: "1.) Credibility Building",
    markdown: `

**Goal:** Show who Zing is and why people can trust the brand through authority and education.

### Format 1: Personality in Front of the Camera

Minimal editing to keep a raw, authentic feel. This format should use captions and visual explainers, but still feel fast, direct, and human.

The structure should follow:

- Tell them what you are going to tell them
- Tell them
- Tell them what you told them

For this series, we think the best approach is to find someone internal to be in front of the camera. We will provide the SOP for filming, write all scripts, and take care of all editing.

The focus of this format will be providing value to the ICP.

### Thought Leadership Hooks

- “We’ve built 100+ websites for small businesses. Here’s what actually gets you clients.”
- “Most small businesses don’t need more traffic. They need this.”
- “We’ve helped businesses go from 0 to fully booked. Here’s what they all did.”
- “If your website isn’t getting clients, it’s because of this.”
- “We’ve worked with hundreds of local businesses. 90% make this mistake.”

### Education Hooks

- “If you run a _____ business, this is all you need to get clients online.”
- “You only need 3 things to get customers online.”
- “This is the simplest way to grow your _____ business online in 2026.”
- “Most people overcomplicate this. Here’s what actually matters.”
- “Succeeding as a _____ business is as easy as _____.”

Make the viewer think:

**“This account gives me value. I will follow this account.”**

Examples:

::videos
[Example 1](https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/zing%20playbook%20examples%2FzingExample1.mp4?alt=media&token=8c155c30-3bfa-4af9-acc9-f2871ae1fc3c)
[Example 2](https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/zing%20playbook%20examples%2FzingExample2.mp4?alt=media&token=95213471-6039-41d5-b2db-c30687a7bb5d)
[Example 3](https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/zing%20playbook%20examples%2FzingExample3.mp4?alt=media&token=f089842f-64df-4850-b1e1-c7d9986b1540)
::

### Format 2: Meet the Team

Raw, fast-paced cameos of different team members giving their opinion.

Example concept:

**“What are the biggest design trends of 2026?”**

The interviewer would ask different team members for their opinion. Another version could be personality-based, similar to the feel of Barstool Sports. Base44 also does a great job with this style.

We like this format because it puts a face to the brand, generating trust and familiarity.

Examples:

::videos
[Example 1](https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/zing%20playbook%20examples%2FzingExample4.mp4?alt=media&token=0a5d758e-100c-425b-9bc1-3abb5fea2abd)
[Example 2](https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/zing%20playbook%20examples%2FzingExample5.mp4?alt=media&token=2335ac14-636b-492e-8833-75e4b8ed64fb)
[Example 3](https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/zing%20playbook%20examples%2FzingExample6.mp4?alt=media&token=d076e192-c8ae-45f4-80c3-b6a592c1c322)
::

### Format 3: Highlight Customer Testimonials

Zoom call or in-person interviews with customers.

The story should focus on:

- Why they needed Zing
- What it was like working with Zing
- The results after using Zing

Editing is key with these so they stand out and feel like engaging stories. We will provide the SOP for recording and scripting.

If a client has a social media presence, these videos can be co-posted, giving mutually beneficial exposure for both accounts.

Examples:

::videos
[Example 1](https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/zing%20playbook%20examples%2FzingExample7.mp4?alt=media&token=a9a129bc-e1d5-4ef0-8c8c-d5e6f2cf6b54)
[Example 2](https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/zing%20playbook%20examples%2FzingExample8.mp4?alt=media&token=53eaa5ef-112e-4fcc-b0f5-c48841c3e96f)
::

---

`,
  },
  {
    id: "relatability",
    label: "2.) Relatability",
    markdown: `


**Goal:** Stop the scroll and create the “that’s me” moment.

### Format 1: Micro Pain Scenarios and Niche-Specific Humor

Relatable and highly shareable content that will resonate with ICPs.

Focus areas:

- Busy founder / owner-operator relatability
- Insider pain points about the job in a specific niche
- Simple, funny moments that make the audience feel seen

Examples:

- [House painter meme account](https://www.instagram.com/pennsylvaniapainter/reels/)
- [Small account getting 1M+ views](https://www.instagram.com/reel/DW9bFyWDeYC/)

This shows the leverage of niche-specific content. An account with around 2K followers can still generate 1M+ views when the content is relatable enough.

### Format 2: Highlight Pain with Other Solutions

Communicate the value of Zing by contrasting it with alternatives.

Content angles:

- “DIY vs Agency vs Zing”
- “Why using a DIY platform is a waste of time”
- “Why working with an agency is a waste of time”
- “Why most small business websites never turn into customers”
`,
  },
  {
    id: "build-product",
    label: "3.) Build: Product in Action",
    markdown: `

**Goal:** Clearly show Zing’s value.

The main points to communicate:

- Quality: local team and industry experts
- Speed: fast setup
- Affordability: lower barrier than agencies or complicated tools

### Format 1: Product Showcase

Engaging and aesthetic demos of websites made by Zing.

This can include:

- Product demos of the 90-second website builder
- Website before/after transformations
- Build-in-public style screen recordings
- Niche-specific website builds

Examples:
::videos
- [Example 1](https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/zing%20playbook%20examples%2FzingExample9.mp4?alt=media&token=9ef2a2bd-165b-4f21-9f2a-879a6a1fce3a)
- [Example 2](https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/zing%20playbook%20examples%2FzingExample10.mp4?alt=media&token=417ed14e-3e10-49e9-beac-19d818548e58)
- [Example 3](https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/zing%20playbook%20examples%2FzingExample11.mp4?alt=media&token=df01b0d8-267a-4558-ab97-045457f52d43)
::
### Format 2: Feature Stacking

Go beyond the website value and showcase all the features Zing provides.

Feature stack:

- Website
- Bookings / lead capture
- Memberships
- Outbound automation

Examples:
::videos
- [Example 1](https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/zing%20playbook%20examples%2FzingExample12.mp4?alt=media&token=c2f06664-3e4f-4c28-b84c-41761d404a68)
- [Example 2](https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/zing%20playbook%20examples%2FzingExample13.mp4?alt=media&token=2b85035e-cf01-453c-997c-3111a06da723)
::

---

`,
  },
  {
    id: "niche-focuses",
    label: "4.) Niche Focuses",
    markdown: `


For the organic content strategy, we are going to have to narrow down target ICPs tso ~5 niches.

It would make sense to focus on the 5 verticals with the highest LTV or wherever growth goals align.

Organic on Instagram performs best when it can clearly categorize your content and understand who it should be shown to. By creating satellite accounts around a specific vertical, we give the platform a stronger signal and make it easier to reach the right audience consistently.

For each niche that is decided, we will create a satellite account that collaborates with the main account.

### Example Niche: Home Services / House Painting

#### Credibility building

- **Format 1:** “If you run a house painting business, this is all you need to get clients online.”
- **Format 3:** “This is ____ with ____ House Painting. Here is how he added 5 leads per week with Zing.”

#### Relatability 

- **Format 1:** Meme that is relatable to house painters.
- **Format 2:** Highlight the pain of DIY platforms, agencies, or not having a working online funnel.

#### Build Product in action 

- **Format 1:** “Build a house painting website in 90 seconds.”
- **Format 2:** “Set up booking for a house painting business.”

---

`,
  },
];
