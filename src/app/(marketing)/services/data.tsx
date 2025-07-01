import {
  People,
  UpTrend,
  Badge,
  Edit,
  Click,
  MegaPhone,
  Eye,
  Rocket2,
  Cycle,
  Target,
  Calendar,
  Chart,
} from "../icons";
import {ProcessData as ProcessDataType} from "./process";
import {FAQData as FAQDataType} from "./faq";

// /services/content-creation -----------------------------------------------------------------------------------
export const ContentCreationServiceDetailsData = [
  {
    title: "Connect with the Right People",
    description:
      "We craft messaging that resonates—tailored to your audience’s mindset, so your content feels relevant, timely, and worth engaging with.",
    icon: <People />,
  },
  {
    title: "Boost Organic Reach",
    description:
      "Our content is built to perform on-platform and in search—designed to attract more eyeballs and grow your audience without paying for every view.",
    icon: <UpTrend />,
  },
  {
    title: "Establish Brand Credibility",
    description:
      "Consistent, high-quality content builds trust. We help position your brand as authentic, reliable, and worth following.",
    icon: <Badge />,
  },
  {
    title: "Drive More Clicks",
    description:
      "We blend sharp copy and visual storytelling to stop the scroll and increase click-throughs across social and search.",
    icon: <Click />,
  },
  {
    title: "Tailored Ideas & Seamless Revisions",
    description:
      "We don’t do cookie-cutter. Every video starts with a custom concept—and we refine it with your feedback until it’s exactly right.",
    icon: <Edit />,
  },
  {
    title: "Stay Top of Mind",
    description:
      "We keep your brand active, visible, and relevant with consistent content that keeps your audience engaged over time.",
    icon: <MegaPhone />,
  },
];

export const ContentCreationProcessData: ProcessDataType = {
  title: "Let’s Build Something Worth Watching",
  description:
    "We begin by understanding your brand, goals, and audience inside and out—laying the groundwork for a content strategy built to drive results.",

  highlights: [
    {
      title: "Discovery & Strategy",
      description:
        "We start by learning your goals, audience, and market dynamics—building a strategic roadmap that aligns with your business objectives.",
    },
    {
      title: "Series Development",
      description:
        "We craft a content series plan, outlining key themes, audience segments, and distribution strategies to guide production and engagement.",
    },
    {
      title: "Video Production",
      description:
        "Our in-house team produces high-quality, on-brand videos that are custom-built for your audience and optimized for performance.",
    },
    {
      title: "Distribution",
      description:
        "We deploy your content across the right channels—strategically timed and platform-optimized to maximize reach, engagement, and impact.",
    },
    {
      title: "Data Reporting",
      description:
        "Performance is tracked through weekly updates in your custom client dashboard. We report on KPIs, engagement, and growth metrics to keep you informed and in control.",
    },
    {
      title: "Ongoing Optimization",
      description:
        "We use real-time data to refine content, adjust targeting, and tweak distribution—ensuring your strategy evolves and improves over time.",
    },
  ],
};

export const ContentCreationFAQData: FAQDataType = [
  {
    id: 1,
    question: "What is the process of content creation?",
    answer:
      "We start by understanding your goals, audience, and market, creating a strategic foundation for a content plan designed to deliver real results.",
  },
  {
    id: 2,
    question: "What platforms do you create content for?",
    answer:
      "We create content optimized for TikTok, Instagram Reels, YouTube Shorts, LinkedIn, and more—each piece tailored to platform algorithms and audience behaviors.",
  },
  {
    id: 3,
    question: "How involved will I be in the creative process?",
    answer:
      "We collaborate closely with you from concept to final cut. You'll be involved in ideation, feedback rounds, and final approvals to ensure everything aligns with your brand.",
  },
  {
    id: 4,
    question: "How long does it take to produce a video?",
    answer:
      "Production timelines vary by scope, but most videos take 1-3 days from initial concept to delivery. We move fast without sacrificing quality.",
  },
  {
    id: 5,
    question: "Can I request revisions?",
    answer:
      "Absolutely. We build in revision rounds as part of our process to ensure the final product meets your expectations and hits the mark.",
  },
  {
    id: 6,
    question: "Do you provide analytics or performance reports?",
    answer:
      "Yes. We track key performance metrics and provide weekly updates through your client dashboard so you can see how your content is performing.",
  },
  {
    id: 7,
    question: "What types of content can you create?",
    answer:
      "We specialize in short-form video content, including brand storytelling, product highlights, social ads, tutorials, and trend-driven formats.",
  },
  {
    id: 8,
    question: "Do you offer strategy as well as production?",
    answer:
      "Yes. We don’t just produce—we help you build a full content strategy, from messaging and audience targeting to distribution and optimization.",
  },
  {
    id: 9,
    question: "Is everything handled in-house?",
    answer:
      "Yes. Our writers, editors, strategists, and marketers are all in-house, ensuring consistency, speed, and quality across the board.",
  },
];
// /services/social-management -----------------------------------------------------------------------------------
export const SocialManagementServiceDetailsData = [
  {
    title: "Platform-Specific Strategy",
    description:
      "We craft tailored strategies for each platform—whether it’s Instagram, TikTok, LinkedIn, or YouTube—to maximize reach and engagement.",
    icon: <Target />,
  },
  {
    title: "Content Planning & Scheduling",
    description:
      "We build out a custom content calendar with curated posts, captions, and timing optimized for consistency and visibility.",
    icon: <Calendar />,
  },
  {
    title: "Community Management",
    description:
      "From replying to comments to engaging with followers, we actively manage your audience to build loyalty and trust.",
    icon: <People />,
  },
  {
    title: "Performance Analytics",
    description:
      "We track key metrics across platforms and provide actionable insights to continuously improve results and ROI.",
    icon: <Chart />,
  },
  {
    title: "Trend Monitoring & Adaptation",
    description:
      "We stay on top of platform trends and cultural moments, adapting your content in real-time to keep your brand relevant.",
    icon: <UpTrend />,
  },
  {
    title: "Stay Ahead of Competitors",
    description:
      "Remain visible, relevant, and in demand by keeping pace with trends, seizing opportunities, and responding faster than the competition.",
    icon: <Rocket2 />,
  },
];

export const SocialManagementProcessData: ProcessDataType = {
  title: "Kickstart Your Social Success",
  description:
    "From planning and content creation to daily management and reporting, our services are designed to drive impact, engagement, and results across the most effective social platforms for your brand.",

  highlights: [
    {
      title: "Onboarding & Strategy",
      description:
        "We start by understanding your brand, goals, and audience. Then, we craft a platform-specific strategy that aligns with your voice and objectives.",
    },
    {
      title: "Content Calendar Creation",
      description:
        "We build a custom monthly content calendar outlining post topics, captions, visuals, and scheduling to keep your social presence consistent and strategic.",
    },
    {
      title: "Content Production",
      description:
        "Our team creates high-quality, on-brand content—from graphics and short-form videos to stories and captions—tailored to each platform's strengths.",
    },
    {
      title: "Publishing & Management",
      description:
        "We handle daily posting, scheduling, and optimization across all selected platforms, ensuring consistent visibility and audience engagement.",
    },
    {
      title: "Community Engagement",
      description:
        "We actively monitor comments, mentions, and DMs (if included), responding in your brand’s tone to keep your audience engaged and supported.",
    },
    {
      title: "Reporting & Optimization",
      description:
        "You’ll receive regular performance reports with insights on reach, engagement, and growth. We use that data to adjust strategy and maximize results.",
    },
  ],
};

export const SocialMediaFAQData: FAQDataType = [
  {
    id: 1,
    question: "Which platforms do you manage?",
    answer:
      "We manage Instagram, TikTok, LinkedIn, YouTube, Facebook, and X (formerly Twitter). We tailor strategies for each based on what performs best.",
  },
  {
    id: 2,
    question: "How often do you post on my behalf?",
    answer:
      "Posting frequency depends on your package and goals, but most clients receive 1–2 posts per dat across all platforms.",
  },
  {
    id: 3,
    question: "Do I need to provide content?",
    answer:
      "You can if you’d like, but it’s not required. We handle content ideation, creation, and editing in-house—customized to your brand.",
  },
  {
    id: 4,
    question: "Will I still have control over what’s posted?",
    answer:
      "Absolutely. You'll approve content in advance and have full visibility through your custom content calendar and dashboard.",
  },
  {
    id: 5,
    question: "Do you respond to comments and DMs?",
    answer:
      "Yes, if you choose our community management add-on. We engage with your audience to build trust, boost visibility, and keep your brand active.",
  },
  {
    id: 6,
    question: "How do you measure success?",
    answer:
      "We track metrics like reach, engagement, follower growth, and click-throughs. You’ll receive regular reports so you know what’s working and why.",
  },
  {
    id: 7,
    question: "Can you help me grow my following?",
    answer:
      "Yes. We use strategic content, trend-driven tactics, and audience targeting to help grow your following with real, engaged users—not bots.",
  },
];
// /services/paid-media -----------------------------------------------------------------------------------
export const PaidMediaProcessData: ProcessDataType = {
  title: "Strategy Meets Precision",
  description:
    "Effective paid media is about more than just great ads—it's about meeting your audience where they are. We help you select the right mix of platforms to drive real results and achieve your business goals.",
  highlights: [
    {
      title: "Google Ads",
      description:
        "Show up when it matters most—right as users search for what you offer. Our search campaigns are designed to maximize visibility, attract high-intent traffic, and generate measurable ROI.",
    },
    {
      title: "Microsoft Bing Ads",
      description:
        "Tap into a high-converting, less competitive audience on Bing. It’s a cost-efficient way to extend your reach and generate quality leads with strong intent.",
    },
    {
      title: "Google Shopping",
      description:
        "Put your products front and center in Google’s shopping results. These visually-driven ads help boost visibility, drive clicks, and increase direct product sales.",
    },
    {
      title: "YouTube Advertising",
      description:
        "Tell your story through video. Whether you’re building brand awareness or retargeting viewers, our YouTube campaigns drive action with engaging, high-impact content.",
    },
    {
      title: "Meta (Facebook) Ads",
      description:
        "Reach the right audience with precision targeting based on interests, behaviors, and demographics. Perfect for lead generation, conversions, and brand building.",
    },
    {
      title: "Meta (Instagram) Ads",
      description:
        "Capture attention with bold visuals and creative messaging. Instagram ads are ideal for visually-driven products and connecting with younger, mobile-first audiences.",
    },
    {
      title: "LinkedIn Ads",
      description:
        "Engage decision-makers and professionals across industries. LinkedIn is the go-to platform for B2B campaigns focused on awareness, leads, and trust-building.",
    },
    {
      title: "TikTok Ads",
      description:
        "Make a splash on one of the fastest-growing platforms. Our TikTok campaigns use trend-driven creative to boost visibility and drive quick, high-volume engagement.",
    },
  ],
};

export const PaidMediaFAQData: FAQDataType = [
  {
    id: 1,
    question: "Which platforms do you run paid campaigns on?",
    answer:
      "We manage paid campaigns across Google Ads, Microsoft Bing, Meta (Facebook & Instagram), LinkedIn, YouTube, and TikTok. Each platform is selected based on your target audience and goals.",
  },
  {
    id: 2,
    question: "How do you determine the best platform for my business?",
    answer:
      "We start with a discovery process to understand your audience, goals, and industry. Based on this, we recommend the platforms most likely to deliver results.",
  },
  {
    id: 3,
    question: "What’s the minimum ad budget I need to get started?",
    answer:
      "Budgets vary depending on your goals and platform, but we typically recommend starting with at least $1,000–$3,000/month to generate meaningful data and results.",
  },
  {
    id: 4,
    question: "Do you handle creative assets for ads?",
    answer:
      "Yes. We handle everything from copywriting and graphic design to video editing—ensuring your ad creative is optimized for each platform and audience.",
  },
  {
    id: 5,
    question: "How do you measure success in a paid media campaign?",
    answer:
      "We track key metrics like click-through rates, conversions, cost per acquisition, and return on ad spend (ROAS). You’ll receive regular reports with clear insights and recommendations.",
  },
  {
    id: 6,
    question: "Can you scale campaigns over time?",
    answer:
      "Absolutely. Once we identify what’s working, we scale your budget and expand targeting to grow results efficiently—without sacrificing performance.",
  },
  {
    id: 7,
    question: "Will I have access to campaign data?",
    answer:
      "Yes. We provide a transparent dashboard and regular performance reports so you can monitor progress, track ROI, and stay informed at every stage.",
  },
];

export const PaidMediaServiceDetailsData = [
  {
    title: "Get Seen Fast",
    description:
      "Launch targeted campaigns that put your brand in front of the right people—instantly. Paid media delivers immediate visibility where it counts.",
    icon: <Eye />,
  },
  {
    title: "Drive Sales & Leads",
    description:
      "Our ad strategies are designed to convert. Whether it’s generating leads or driving eCommerce sales, we focus on bottom-line impact.",
    icon: <UpTrend />,
  },
  {
    title: "Stay Ahead of Competitors",
    description:
      "We analyze your market and competition to position your brand strategically—so your ads outperform and outshine others in your space.",
    icon: <Rocket2 />,
  },
  {
    title: "Scale with Confidence",
    description:
      "We build campaigns that scale. With constant optimization and detailed tracking, we ensure you grow with control and clarity.",
    icon: <Cycle />,
  },
  {
    title: "Reach Who Matters",
    description:
      "Hyper-targeted ads help you connect with your ideal audience based on behavior, interests, demographics, and more—no wasted spend.",
    icon: <MegaPhone />,
  },
  {
    title: "Cut Through the Noise",
    description:
      "Organic reach is limited—ads give you the edge. We use creative strategy and paid distribution to beat the algorithm and boost engagement.",
    icon: <Target />,
  },
];
