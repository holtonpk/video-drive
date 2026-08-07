import React from "react";
import Image from "next/image";
import {Source_Serif_4, Inter, IBM_Plex_Mono} from "next/font/google";
import {constructMetadata} from "@/lib/utils";

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const displayFont = Source_Serif_4({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata = constructMetadata({
  title: "Elphadel Social Media Content Plan",
  description: "Social media content strategy prepared by Ripple Media for Elphadel.",
});

const INK = "#28231e";
const PAPER = "#f4f1ea";
const PAPER_2 = "#eae4d6";
const ACCENT = "#922f21";
const ACCENT_DARK = "#7f281c";
const RULE_HAIR = "#28231e1a";
const MUTED = "#6b6459";
const BODY_TEXT = "#3b352e";

const navSections = [
  {id: "overview", label: "Overview"},
  {id: "insights", label: "Key Insights"},
  {id: "pillars", label: "Content Pillars"},
  {id: "month1", label: "Month 1"},
  {id: "month2", label: "Month 2"},
  {id: "accounts", label: "Accounts"},
  {id: "measurement", label: "Measurement"},
  {id: "offers", label: "Offers"},
];

const funnelSteps = [
  "Content engagement",
  "Landing page",
  "Sign up",
  "First hypothesis tested",
];

const keyInsights = [
  {
    title: "The product is the content",
    body: "The strongest angle Elphadel has is testing things people already argue about. Retail investors are surrounded by claims: “Buy the dip.” “Sell in May.” “The golden cross works.” Almost none of it is ever tested with data. Elphadel can test all of it in plain English and show the answer. This is native, high performing content on TikTok, Reels, YouTube, and X. It stops the scroll, it settles arguments, and it demonstrates the product without feeling like an ad. This is the core engine.",
  },
  {
    title: "Your X presence could be a growth channel, in writing",
    notConfirmed:
      "Not confirmed. You mentioned it on the call, so it's included as an option to consider, not a confirmed part of the plan. Everything else runs with or without it.",
    body: "If you want to start the X account for investors and VCs you mentioned, it could become a growth channel in its own right, and it would not require being on camera. Written content on X can build trust, reach investors and FinTwit, and give Elphadel a second audience stream that compounds over time. Build in public updates, backtest result threads, and honest takes on retail investing tend to earn attention a brand account cannot. If pursued, we'd handle the strategy and ghostwriting so it stays consistent without adding to your plate. Low cost, high leverage, entirely optional.",
  },
  {
    title: "Trading has a massive, active creator ecosystem",
    body: "FinTok and FinTwit are already huge. There is a deep bench of retail investing creators, finance meme accounts, and backtesting style channels whose audiences are exactly Elphadel's ICP. This makes UGC and influencer content unusually strong for this product, because the creators and the audience already exist. We do not have to build the category.",
  },
  {
    title: "Keep the main account tightly categorized around trading",
    body: "Instagram and TikTok reward accounts that are clearly about one thing. Because trading is the first vertical, the main account should stay focused on trading and investing content so the algorithm knows exactly who to show it to. When Elphadel expands into new verticals like sports analytics, that is when a satellite account strategy makes sense: one focused account per vertical, each clearly categorized, all feeding the main brand. For now, focus creates reach.",
  },
  {
    title: "Volume and consistency require a system",
    body: "High output does not come from making content ad hoc. It comes from a repeatable process: a few high value long form pieces feed a large volume of short form clips and written posts across platforms. We build that engine so output scales without quality dropping.",
  },
];

const pillars = [
  {
    number: "01",
    name: "Product in Action",
    goal: "Show what Elphadel does by testing things people care about. This is the primary pillar and the main growth driver.",
    formats: [
      "Myth testing: take a popular trading belief and test it. “Everyone says buy the dip. I tested it. Here's what actually happened.”",
      "Idea to answer demos: type a thesis in plain English, get a real result on screen.",
      "Reaction tests: a finance influencer makes a claim, Elphadel tests whether it's true.",
      "“You do not need to code to backtest your ideas anymore.”",
    ],
    hooks: [
      "Does buying the dip actually work? I tested it.",
      "I backtested the most popular strategy on FinTok. It loses money.",
      "I typed my investment thesis in plain English and got a real answer in seconds.",
      "Everyone repeats this trading rule. Nobody has ever tested it. So I did.",
      "Stop guessing whether your trading idea works. Test it.",
    ],
  },
  {
    number: "02",
    name: "Credibility and Education",
    goal: "Build trust and authority, and make the audience feel like the account gives them value.",
    formats: [
      "Your written content on X (optional, not confirmed) — no camera. If you pursue it, written posts and threads explaining why Elphadel exists, fully ghostwritten by us.",
      "Build in public on X — real product updates, real backtest results, honest lessons, all in writing.",
      "Faceless education on the brand account — plain English explainers built from screen recordings, text on screen, and voiceover. No on camera talent required.",
    ],
    founderAngles: [
      "“Retail investors do not lose because they are dumb. They lose because they can never test anything.”",
      "“The gap between having an idea and knowing if it works used to require a quant. Not anymore.”",
      "“Why I'm building a tool that lets anyone test an investment idea in plain English.”",
      "“Three trading rules everyone repeats that fall apart the moment you test them.”",
    ],
  },
  {
    number: "03",
    name: "Relatability",
    goal: "Stop the scroll and create the “that is me” moment.",
    formats: [
      "Retail investor humor — the gap between what people think they are doing and what they are actually doing.",
      "Insider pain — watching a stock rip right after you sell, the 2am “genius” trading idea, trusting a random tip.",
      "Simple, funny moments that make the audience feel seen.",
    ],
    note: "This content builds top of funnel reach and warms up an audience that the product and education pillars then convert. Niche relatability travels far — small accounts regularly hit large view counts when the content is specific enough to feel personal.",
  },
];

const month1Deliverables = [
  {
    title: "Short form product content",
    meta: "12 short form videos / month",
    body: "Focused on the Product in Action pillar, testing multiple ways to demonstrate the value.",
    list: [
      "Myth testing content",
      "Plain English idea to answer demos",
      "Reaction tests to popular finance claims",
      "Pain first hooks around guessing instead of testing",
      "Different CTA styles into sign up",
    ],
    footer: "Primary distribution: Instagram Reels, TikTok, YouTube Shorts. Primary CTA: “Test your first idea free.”",
  },
  {
    title: "Your written content on X",
    meta: "3 posts or threads / week",
    notConfirmed:
      "Not confirmed. This only applies if you decide to pursue a personal X presence. It's a possibility, not a decided part of the scope — if it's not pursued, nothing else in the plan changes.",
    body: "If pursued, you could stay off camera. This is written content on your personal X account: build in public updates, backtest result threads, and takes on what's broken in retail investing. It builds the personal brand you mentioned and reaches investors and FinTwit. We'd handle it end to end so it doesn't add to your workload.",
    list: [
      "X content strategy and calendar",
      "Post and thread ghostwriting",
      "Backtest results packaged into shareable threads",
      "Charts and visual assets for posts",
      "Content direction and a light review from you before posting",
    ],
  },
  {
    title: "Long form video",
    meta: "2 long form videos / month",
    body: "Data rich videos built around what retail investors search for on YouTube, and around the most interesting backtest results. These anchor authority and search presence, and feed short form clips and written posts.",
    list: [
      "Does buying the dip actually work, tested with data",
      "What backtesting is and why every investor should do it",
      "Common trading beliefs that fall apart when you test them",
      "How to test an investment idea without knowing how to code",
    ],
  },
  {
    title: "X and written repurposing",
    body: "Long form content is repurposed into written posts for X and LinkedIn. Backtest results in particular make strong, shareable threads. This tests written messaging around the primary action and builds credibility with the finance and investor audience.",
  },
  {
    title: "UGC and creator pipeline development",
    body: "During Month 1 we build the list of relevant creators for Month 2 activation. This sourcing work is covered by the retainer, so no creator spend happens yet.",
    list: [
      "FinTok and retail investing creators whose audience matches the ICP",
      "Finance meme and commentary accounts",
      "Creators who can credibly test their own ideas with Elphadel on camera",
    ],
  },
];

const month2Deliverables = [
  {
    title: "Data led creative iteration",
    body: "At the start of Month 2 we review Month 1 to identify winners, then build around them instead of guessing.",
    list: [
      "Best performing hooks",
      "Best performing formats",
      "Highest click through CTAs",
      "Strongest paths from content into sign up and first test",
    ],
  },
  {
    title: "Continued short form content",
    meta: "12 short form videos / month",
    body: "Weighted toward the formats that showed the strongest signal in Month 1: more of the winning myth tests, more of the highest performing demo style, more of the best hooks.",
  },
  {
    title: "Your continued written content on X",
    meta: "3 posts or threads / week",
    notConfirmed:
      "Not confirmed. Only applies if you decide to pursue the X presence described in Month 1.",
    body: "If active, your written X presence keeps compounding, now guided by which topics and post formats performed best in Month 1. Still fully ghostwritten and off camera.",
  },
  {
    title: "UGC and creator activation",
    body: "Month 2 brings in external voices to make the product feel proven and relatable. This moves Elphadel beyond brand led messaging into authentic third party proof.",
    list: [
      "“Testing Elphadel with my dumbest trading idea”",
      "“I asked AI to backtest my strategy in plain English”",
      "“I finally tested whether my trading rule actually works”",
      "Creator reactions testing their own or their audience's claims",
    ],
    footer: "Creator payments come from the separate, client approved creator budget that sits on top of the retainer.",
  },
  {
    title: "Paid amplification recommendation",
    body: "Once organic content shows traction, we introduce paid spend behind the strongest creative. Rather than putting budget behind untested ads, we amplify content that already performed organically.",
    footer: "Organic identifies the winners. Paid scales the winners. Targets: retail investor and finance audiences, lookalikes of engaged users, and retargeting for site visitors who started but didn't finish sign up.",
  },
];

const accountStrategy = [
  {
    name: "Main brand account",
    body: "Tightly categorized around trading and investing so the algorithm shows it to the right people. Runs on all short form platforms.",
  },
  {
    name: "Your X account",
    notConfirmed: "Optional, not confirmed.",
    body: "If you pursue it, your X account is written only, no video. Build in public, backtest threads, investor and FinTwit reach, fully ghostwritten and managed by us.",
  },
  {
    name: "X, LinkedIn, Reddit as support",
    body: "X and LinkedIn for written repurposing and your personal brand. Reddit for text and data posts in relevant investing communities, since video does not perform there.",
  },
];

const supportingMetrics = [
  "Video views",
  "Watch time and retention",
  "Engagement rate",
  "Profile visits",
  "Click through rate to the site",
  "Sign up conversion rate",
  "Activation rate (first test run)",
  "Early retention",
];

const retainerIncludes = [
  "12 short form videos per month across Instagram, TikTok, and YouTube Shorts",
  "Managing your X presence (optional, only if pursued): 3 written posts or threads per week, fully ghostwritten and off camera",
  "2 long form videos per month, repurposed into short form",
  "Written repurposing across X and LinkedIn",
  "Creator sourcing, vetting, briefing, and coordination",
  "Full production: scripting, filming SOP, Bay Area videographer support, editing, captions",
];

const creatorBudgetPoints = [
  "Month 1: no creator spend. The pipeline is being built, and that work is already covered by the retainer.",
  "From Month 2: you set a monthly creator budget. We source, brief, and manage creators against it, keeping the same owned output running underneath.",
  "Billed at cost plus a 15% management fee, itemized so you see exactly what each creator was paid.",
  "Typical starting range: $2,000 to $5,000 per month, scaling with the volume of creator posts.",
];

const Eyebrow = ({children}: {children: React.ReactNode}) => (
  <p
    className="text-xs uppercase tracking-[0.14em] mb-2"
    style={{color: ACCENT, fontFamily: monoFont.style.fontFamily}}
  >
    {children}
  </p>
);

const SectionHeading = ({
  id,
  number,
  title,
}: {
  id: string;
  number: string;
  title: string;
}) => (
  <div id={id} className="flex flex-col gap-3 scroll-mt-28">
    <Eyebrow>{number}</Eyebrow>
    <h2
      className={`text-3xl sm:text-4xl ${displayFont.className}`}
      style={{color: INK, fontWeight: 400, letterSpacing: "-0.01em"}}
    >
      {title}
    </h2>
    <hr style={{borderColor: RULE_HAIR}} />
  </div>
);

const NotConfirmed = ({children}: {children: React.ReactNode}) => (
  <div
    className="flex items-start gap-3 rounded-[8px] p-4 border border-dashed"
    style={{borderColor: `${INK}40`, backgroundColor: `${INK}0a`}}
  >
    <span
      className="text-[10px] uppercase tracking-[0.1em] font-semibold shrink-0 mt-0.5 px-2 py-1 rounded-full whitespace-nowrap"
      style={{
        backgroundColor: `${INK}14`,
        color: INK,
        fontFamily: monoFont.style.fontFamily,
      }}
    >
      Not confirmed
    </span>
    <p className="text-sm" style={{color: MUTED}}>
      {children}
    </p>
  </div>
);

const Page = () => {
  return (
    <div
      className={`min-h-screen scroll-smooth ${bodyFont.className}`}
      style={{backgroundColor: PAPER, color: INK}}
    >
      {/* Header + nav */}
      <header
        className="sticky top-0 z-10 border-b backdrop-blur"
        style={{borderColor: RULE_HAIR, backgroundColor: `${PAPER}f2`}}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <Image
              src="/elphadel/logo.png"
              alt="Elphadel"
              width={32}
              height={32}
              priority
            />
            <span
              className={`text-lg tracking-[0.08em] uppercase ${displayFont.className}`}
              style={{color: ACCENT}}
            >
              Elphadel
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-5 overflow-x-auto">
            {navSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="text-xs uppercase tracking-[0.08em] whitespace-nowrap hover:opacity-70 transition-opacity"
                style={{color: MUTED, fontFamily: monoFont.style.fontFamily}}
              >
                {section.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="md:hidden container mx-auto px-6 pb-3 flex items-center gap-4 overflow-x-auto">
          {navSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="text-xs uppercase tracking-[0.08em] whitespace-nowrap"
              style={{color: MUTED, fontFamily: monoFont.style.fontFamily}}
            >
              {section.label}
            </a>
          ))}
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 pt-14 pb-14 max-w-[820px]">
        <Eyebrow>Social Media Content Plan</Eyebrow>
        <h1
          className={`text-4xl sm:text-5xl mb-5 ${displayFont.className}`}
          style={{
            color: INK,
            fontWeight: 360,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Applied AI for quantitative investment research, turned into
          content people can&apos;t scroll past.
        </h1>
        <p className="text-lg max-w-[640px]" style={{color: MUTED}}>
          Elphadel lets everyday people test their ideas using quantitative
          methods, in plain natural language, without needing to code or know
          quant. The first vertical is trading. This plan covers organic
          social content only.
        </p>
        <p
          className="mt-6 text-xs uppercase tracking-[0.1em]"
          style={{color: `${INK}80`, fontFamily: monoFont.style.fontFamily}}
        >
          Prepared by Ripple Media
        </p>
      </section>

      <div className="container mx-auto px-6 flex flex-col gap-20 pb-32 max-w-[900px]">
        {/* Overview */}
        <section className="flex flex-col gap-8">
          <SectionHeading id="overview" number="Overview" title="The Wedge" />
          <p className="text-lg max-w-[680px]" style={{color: BODY_TEXT}}>
            That is a rare thing in social content: a product whose core
            action is inherently interesting to watch. People love watching
            claims get tested. Elphadel turns &ldquo;I think this trading
            strategy works&rdquo; into &ldquo;let&apos;s actually find
            out.&rdquo; That is the wedge.
          </p>

          <div className="flex flex-col gap-4">
            <p
              className="text-xs uppercase tracking-[0.1em]"
              style={{color: ACCENT, fontFamily: monoFont.style.fontFamily}}
            >
              The primary action
            </p>
            <p
              className={`text-2xl sm:text-3xl ${displayFont.className}`}
              style={{color: INK}}
            >
              Getting people to sign up and test their first idea.
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {funnelSteps.map((step, index) => (
                <React.Fragment key={step}>
                  <span
                    className="text-sm px-4 py-2 rounded-full border"
                    style={{
                      borderColor: RULE_HAIR,
                      backgroundColor: "#fff",
                      color: INK,
                    }}
                  >
                    {step}
                  </span>
                  {index < funnelSteps.length - 1 ? (
                    <span style={{color: ACCENT}}>&rarr;</span>
                  ) : null}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-px mt-2" style={{backgroundColor: RULE_HAIR}}>
            <div className="flex flex-col gap-2 p-6" style={{backgroundColor: PAPER}}>
              <span
                className="text-xs uppercase tracking-[0.1em]"
                style={{color: ACCENT, fontFamily: monoFont.style.fontFamily}}
              >
                Phase 1 &middot; Month 1
              </span>
              <h3 className={`text-xl ${displayFont.className}`} style={{color: INK}}>
                Test
              </h3>
              <p className="text-base" style={{color: MUTED}}>
                Build the foundation, launch loud, test creative direction,
                and establish the content production process.
              </p>
            </div>
            <div className="flex flex-col gap-2 p-6" style={{backgroundColor: PAPER}}>
              <span
                className="text-xs uppercase tracking-[0.1em]"
                style={{color: ACCENT, fontFamily: monoFont.style.fontFamily}}
              >
                Phase 2 &middot; Month 2
              </span>
              <h3 className={`text-xl ${displayFont.className}`} style={{color: INK}}>
                Scale
              </h3>
              <p className="text-base" style={{color: MUTED}}>
                Use performance data to double down on winning formats, keep
                building your personal brand, activate UGC and creator content,
                and begin paid amplification behind validated content.
              </p>
            </div>
          </div>
        </section>

        {/* Key Insights */}
        <section className="flex flex-col gap-6">
          <SectionHeading id="insights" number="01 · Strategy" title="Key Insights" />
          <p className="text-lg max-w-[680px]" style={{color: BODY_TEXT}}>
            These insights come from how the strongest consumer and fintech
            accounts grow, and from what makes Elphadel specifically well
            suited to social.
          </p>
          <div className="flex flex-col gap-8">
            {keyInsights.map((insight, index) => (
              <div
                key={insight.title}
                className="flex gap-5 items-start py-6 border-b"
                style={{borderColor: RULE_HAIR}}
              >
                <span
                  className="text-sm w-6 shrink-0 pt-1"
                  style={{color: ACCENT, fontFamily: monoFont.style.fontFamily}}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-semibold" style={{color: INK}}>
                    {insight.title}
                  </h3>
                  {insight.notConfirmed ? (
                    <NotConfirmed>{insight.notConfirmed}</NotConfirmed>
                  ) : null}
                  <p className="text-base" style={{color: BODY_TEXT}}>
                    {insight.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Content Pillars */}
        <section className="flex flex-col gap-8">
          <SectionHeading id="pillars" number="02 · Strategy" title="Content Pillars" />
          <p className="text-lg max-w-[680px]" style={{color: BODY_TEXT}}>
            Three pillars guide everything we create. Every piece needs a
            strong hook, fast pacing, and clear value in under ten seconds.
          </p>
          <div className="flex flex-col gap-10">
            {pillars.map((pillar) => (
              <div
                key={pillar.number}
                className="flex flex-col gap-5 p-6 rounded-[8px] border"
                style={{borderColor: RULE_HAIR, backgroundColor: "#fff"}}
              >
                <div className="flex flex-col gap-1">
                  <span
                    className="text-xs uppercase tracking-[0.1em]"
                    style={{color: ACCENT, fontFamily: monoFont.style.fontFamily}}
                  >
                    Pillar {pillar.number}
                  </span>
                  <h3 className={`text-2xl ${displayFont.className}`} style={{color: INK}}>
                    {pillar.name}
                  </h3>
                  <p className="text-base mt-1" style={{color: MUTED}}>
                    {pillar.goal}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <p
                    className="text-xs uppercase tracking-[0.1em]"
                    style={{color: `${INK}80`, fontFamily: monoFont.style.fontFamily}}
                  >
                    Formats
                  </p>
                  <ul className="flex flex-col gap-2">
                    {pillar.formats.map((format, i) => (
                      <li key={i} className="flex gap-3 text-sm" style={{color: BODY_TEXT}}>
                        <span style={{color: ACCENT}}>&bull;</span>
                        <span>{format}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {pillar.hooks ? (
                  <div className="flex flex-col gap-2">
                    <p
                      className="text-xs uppercase tracking-[0.1em]"
                      style={{color: `${INK}80`, fontFamily: monoFont.style.fontFamily}}
                    >
                      Hooks
                    </p>
                    <ul className="flex flex-col gap-2">
                      {pillar.hooks.map((hook, i) => (
                        <li
                          key={i}
                          className="text-sm italic rounded-[6px] px-3 py-2"
                          style={{color: INK, backgroundColor: PAPER_2}}
                        >
                          &ldquo;{hook}&rdquo;
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {pillar.founderAngles ? (
                  <div className="flex flex-col gap-2">
                    <NotConfirmed>
                      Your X post and thread angles — only applies if you
                      pursue a personal X presence.
                    </NotConfirmed>
                    <ul className="flex flex-col gap-2 mt-1">
                      {pillar.founderAngles.map((angle, i) => (
                        <li
                          key={i}
                          className="text-sm italic rounded-[6px] px-3 py-2"
                          style={{color: INK, backgroundColor: PAPER_2}}
                        >
                          &ldquo;{angle}&rdquo;
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {pillar.note ? (
                  <p className="text-sm" style={{color: MUTED}}>
                    {pillar.note}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {/* Month 1 */}
        <section className="flex flex-col gap-6">
          <SectionHeading
            id="month1"
            number="03 · Phase 1"
            title="Month 1 — Launch Sprint and Testing"
          />
          <p className="text-lg max-w-[680px]" style={{color: BODY_TEXT}}>
            Launch loud and identify the strongest hooks, formats, and angles
            for driving sign ups and first tests. Because Elphadel launches in
            roughly two weeks, Month 1 is timed so UGC and organic content
            land around and immediately after launch.
          </p>
          <div className="flex flex-col gap-6">
            {month1Deliverables.map((item, index) => (
              <div
                key={item.title}
                className="flex flex-col gap-3 p-6 rounded-[8px] border"
                style={{borderColor: RULE_HAIR, backgroundColor: "#fff"}}
              >
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <h3 className="text-lg font-semibold flex items-baseline gap-2" style={{color: INK}}>
                    <span
                      className="text-sm"
                      style={{color: ACCENT, fontFamily: monoFont.style.fontFamily}}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.title}
                  </h3>
                  {item.meta ? (
                    <span
                      className="text-xs uppercase tracking-[0.08em] px-3 py-1 rounded-full"
                      style={{backgroundColor: PAPER_2, color: INK}}
                    >
                      {item.meta}
                    </span>
                  ) : null}
                </div>
                {item.notConfirmed ? <NotConfirmed>{item.notConfirmed}</NotConfirmed> : null}
                <p className="text-base" style={{color: BODY_TEXT}}>
                  {item.body}
                </p>
                {item.list ? (
                  <ul className="flex flex-col gap-1.5 mt-1">
                    {item.list.map((li, i) => (
                      <li key={i} className="flex gap-2 text-sm" style={{color: MUTED}}>
                        <span style={{color: ACCENT}}>&bull;</span>
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {item.footer ? (
                  <p className="text-xs mt-1" style={{color: `${INK}80`}}>
                    {item.footer}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {/* Month 2 */}
        <section className="flex flex-col gap-6">
          <SectionHeading
            id="month2"
            number="04 · Phase 2"
            title="Month 2 — Scale What Works"
          />
          <p className="text-lg max-w-[680px]" style={{color: BODY_TEXT}}>
            Use Month 1 data to identify winning messaging and formats, then
            scale the content most likely to drive sign ups and first tests.
            Month 2 shifts from broad testing to focused iteration.
          </p>
          <div className="flex flex-col gap-6">
            {month2Deliverables.map((item, index) => (
              <div
                key={item.title}
                className="flex flex-col gap-3 p-6 rounded-[8px] border"
                style={{borderColor: RULE_HAIR, backgroundColor: "#fff"}}
              >
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <h3 className="text-lg font-semibold flex items-baseline gap-2" style={{color: INK}}>
                    <span
                      className="text-sm"
                      style={{color: ACCENT, fontFamily: monoFont.style.fontFamily}}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.title}
                  </h3>
                  {item.meta ? (
                    <span
                      className="text-xs uppercase tracking-[0.08em] px-3 py-1 rounded-full"
                      style={{backgroundColor: PAPER_2, color: INK}}
                    >
                      {item.meta}
                    </span>
                  ) : null}
                </div>
                {item.notConfirmed ? <NotConfirmed>{item.notConfirmed}</NotConfirmed> : null}
                <p className="text-base" style={{color: BODY_TEXT}}>
                  {item.body}
                </p>
                {item.list ? (
                  <ul className="flex flex-col gap-1.5 mt-1">
                    {item.list.map((li, i) => (
                      <li key={i} className="flex gap-2 text-sm" style={{color: MUTED}}>
                        <span style={{color: ACCENT}}>&bull;</span>
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {item.footer ? (
                  <p className="text-xs mt-1" style={{color: `${INK}80`}}>
                    {item.footer}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {/* Accounts */}
        <section className="flex flex-col gap-6">
          <SectionHeading
            id="accounts"
            number="05 · Distribution"
            title="Account and Distribution Strategy"
          />
          <p className="text-lg max-w-[680px]" style={{color: BODY_TEXT}}>
            For now, focus wins.
          </p>
          <div className="grid md:grid-cols-3 gap-px" style={{backgroundColor: RULE_HAIR}}>
            {accountStrategy.map((account) => (
              <div
                key={account.name}
                className="flex flex-col gap-3 p-6"
                style={{backgroundColor: PAPER}}
              >
                <h3 className={`text-xl ${displayFont.className}`} style={{color: INK}}>
                  {account.name}
                </h3>
                {account.notConfirmed ? (
                  <span
                    className="text-[10px] uppercase tracking-[0.1em] font-semibold px-2 py-1 rounded-full w-fit"
                    style={{
                      backgroundColor: `${INK}14`,
                      color: INK,
                      fontFamily: monoFont.style.fontFamily,
                    }}
                  >
                    {account.notConfirmed}
                  </span>
                ) : null}
                <p className="text-base" style={{color: MUTED}}>
                  {account.body}
                </p>
              </div>
            ))}
          </div>
          <p className="text-base max-w-[680px]" style={{color: MUTED}}>
            <strong style={{color: INK}}>Future satellite accounts:</strong>{" "}
            when Elphadel expands into new verticals like sports analytics,
            each new vertical gets its own focused account that feeds the
            main brand. That is the point at which a multi account strategy
            earns its keep.
          </p>
        </section>

        {/* Measurement */}
        <section className="flex flex-col gap-6">
          <SectionHeading
            id="measurement"
            number="06 · Results"
            title="Measurement and Success"
          />
          <div
            className="flex flex-col gap-2 max-w-[680px] rounded-[8px] p-6 border-l-4"
            style={{backgroundColor: `${ACCENT}14`, borderColor: ACCENT}}
          >
            <p
              className="text-xs uppercase tracking-[0.1em]"
              style={{color: ACCENT, fontFamily: monoFont.style.fontFamily}}
            >
              Primary measure of success
            </p>
            <p className="text-xl font-medium" style={{color: INK}}>
              Sign ups and first ideas tested.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p
              className="text-xs uppercase tracking-[0.1em]"
              style={{color: `${INK}80`, fontFamily: monoFont.style.fontFamily}}
            >
              Supporting metrics
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {supportingMetrics.map((metric) => (
                <div
                  key={metric}
                  className="text-sm px-4 py-3 rounded-[6px]"
                  style={{backgroundColor: "#fff", color: BODY_TEXT, border: `1px solid ${RULE_HAIR}`}}
                >
                  {metric}
                </div>
              ))}
            </div>
          </div>
          <p className="text-base max-w-[680px]" style={{color: MUTED}}>
            The goal is to connect content performance directly to sign ups
            and activated users. We track all available data across
            platforms and report on what is driving the primary action.
          </p>
        </section>

        {/* Offers */}
        <section className="flex flex-col gap-8">
          <SectionHeading
            id="offers"
            number="07 · Investment"
            title="Offers and Packages"
          />
          <p className="text-lg max-w-[680px]" style={{color: BODY_TEXT}}>
            The engagement has two parts. A flat monthly retainer covers
            everything Ripple produces and manages. A separate creator budget
            covers the money paid to UGC creators and influencers, so the
            retainer stays the same every month while creator spend scales up
            or down at your discretion.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div
              className="flex flex-col gap-4 p-6 rounded-[8px] border"
              style={{borderColor: RULE_HAIR, backgroundColor: "#fff"}}
            >
              <div className="flex flex-col gap-1">
                <span
                  className="text-xs uppercase tracking-[0.1em]"
                  style={{color: ACCENT, fontFamily: monoFont.style.fontFamily}}
                >
                  Production and Management Retainer
                </span>
                <h3 className={`text-3xl ${displayFont.className}`} style={{color: INK}}>
                  $5,000<span className="text-lg" style={{color: MUTED}}> / month</span>
                </h3>
                <p className="text-sm mt-1" style={{color: MUTED}}>
                  Flat, every month. This is the base engine. It does not
                  change when creator content turns on.
                </p>
              </div>
              <ul className="flex flex-col gap-2">
                {retainerIncludes.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm" style={{color: BODY_TEXT}}>
                    <span style={{color: ACCENT}}>&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="flex flex-col gap-4 p-6 rounded-[8px] border"
              style={{borderColor: RULE_HAIR, backgroundColor: "#fff"}}
            >
              <div className="flex flex-col gap-1">
                <span
                  className="text-xs uppercase tracking-[0.1em]"
                  style={{color: ACCENT, fontFamily: monoFont.style.fontFamily}}
                >
                  Creator and Media Budget
                </span>
                <h3 className={`text-3xl ${displayFont.className}`} style={{color: INK}}>
                  Variable
                </h3>
                <p className="text-sm mt-1" style={{color: MUTED}}>
                  Client approved. Paid directly to UGC creators and
                  influencers, plus any paid amplification.
                </p>
              </div>
              <ul className="flex flex-col gap-2">
                {creatorBudgetPoints.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm" style={{color: BODY_TEXT}}>
                    <span style={{color: ACCENT}}>&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p
              className="text-xs uppercase tracking-[0.1em]"
              style={{color: `${INK}80`, fontFamily: monoFont.style.fontFamily}}
            >
              How the months look
            </p>
            <div className="grid sm:grid-cols-2 gap-px" style={{backgroundColor: RULE_HAIR}}>
              <div className="flex flex-col gap-1 p-6" style={{backgroundColor: PAPER}}>
                <span className="text-sm font-semibold" style={{color: INK}}>
                  Month 1
                </span>
                <p className="text-sm" style={{color: MUTED}}>
                  $5,000 retainer, no creator spend. The pipeline gets built.
                </p>
              </div>
              <div className="flex flex-col gap-1 p-6" style={{backgroundColor: PAPER}}>
                <span className="text-sm font-semibold" style={{color: INK}}>
                  Month 2 and beyond
                </span>
                <p className="text-sm" style={{color: MUTED}}>
                  $5,000 retainer, same owned output, plus the creator budget
                  you approve.
                </p>
              </div>
            </div>
          </div>

          <p className="text-base max-w-[680px]" style={{color: BODY_TEXT}}>
            You always see owned content and creator spend as two separate
            lines, so the total is transparent and the creator volume is
            yours to control. After the first weeks of data, we&apos;ll
            recommend the creator volume that actually moves the number, and
            the point where more stops adding return.
          </p>
        </section>
      </div>

      <footer
        className="border-t"
        style={{borderColor: RULE_HAIR, backgroundColor: PAPER}}
      >
        <div
          className="container mx-auto px-6 py-6 text-xs uppercase tracking-[0.1em]"
          style={{color: `${INK}66`, fontFamily: monoFont.style.fontFamily}}
        >
          Prepared by Ripple Media for Elphadel
        </div>
      </footer>
    </div>
  );
};

export default Page;
