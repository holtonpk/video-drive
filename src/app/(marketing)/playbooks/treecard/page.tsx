import Image from "next/image";
import {
  Lightbulb,
  Brain,
  Goal,
  Users,
  Eye,
  Camera,
  Gem,
  LucideProps,
  Target,
} from "lucide-react";
import {Phone} from "lucide-react";
import Link from "next/link";
import {constructMetadata} from "@/lib/utils";
import {SeriesIdeas} from "./series-ideas";
import InstagramData from "./instagram/instagram";
import TiktokData from "./tiktok/tiktok";
import SocialAudit from "./social-audit";
export const metadata = constructMetadata({
  title: "Treecard Playbook",
  description: "A playbook for Treecard",
});

const Page = () => {
  return (
    <div className="flex flex-col items-center px-4 bg-white w-screen  mdscontainer mx-auto gap-8 py-6">
      {/* <Link
        href="https://calendly.com/holtonpk/30min"
        target="_blank"
        className="fixed bottom-4 right-4 bg-[#233461] text-[#0f1115] px-4 py-2 rounded-md flex items-center z-[999]"
      >
        <Phone className="w-4 h-4 mr-2" />
        Let&apos;s chat
      </Link> */}
      <div className="flex flex-col items-center gap-2">
        <div className="h-16 w-16 bg-white border flex items-center justify-center  rounded-md overflow-hidden shadow-md">
          <Image src="/treecard/logo.png" alt="Mozi" width={100} height={100} />
        </div>
        <h1 className="text-4xl font-bold text-center text-[#0A5153]">
          Treecard Playbook
        </h1>
        <p className="max-w-[500px] text-center  text-[#00AE70]">
          We&apos;ve developed this playbook to help continue your media growth.
        </p>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-[1000px]">
        <h2 className="text-2xl font-bold mt-10 flex items-center gap-2 text-[#0A5153]">
          <Eye className="w-5 h-5" />
          Opportunity we see
        </h2>
        <div className="flex flex-col gap-3 text-black bg-white p-4 rounded-md shadow-md border">
          <p>
            <b>Validated Organic Interest:</b> With 500K+ followers and
            consistent viewership, there's a strong foundation of brand
            awareness. This size gives us room to test, learn, and
            scale—organically and with paid support. The large following signals
            trust and legitimacy, but it&apos;s underutilized due to a mismatch
            in tone and targeting.
          </p>
          <p>
            <b>Inherent Virality in the Mission:</b> The nature of the
            product—planting trees through everyday actions—is easily shareable,
            especially with Gen Z&apos;s love of purpose-driven brands. It has a
            “wait, this exists?” appeal. There&apos;s built-in surprise,
            emotional reward, and social currency. We just need to package it
            right.
          </p>

          <p>
            <b>Endless Content Potential:</b> The intersection of tech, climate
            impact, and micro-habit behavior change opens the door to a wide
            range of content types: storytelling, education, personal
            challenges, creator partnerships, behind-the-scenes, brand
            mythbusting, and more. This can fuel ongoing social series for
            months without feeling repetitive
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-[1000px]">
        <h2 className="text-2xl font-bold mt-10 flex items-center gap-2 text-[#0A5153]">
          <Brain className="w-5 h-5" />
          High Level Strategy - The 2 Sided Formula
        </h2>
        <div className="flex flex-col gap-3 text-black bg-white p-4 rounded-md shadow-md border">
          <p>
            <b>The 80/20 Split Strategy:</b> Our content strategy will use a
            80/20 split, where 80% of the content focuses on high-value, bottom
            of funnel content that engages and builds long-term relationships,
            while the remaining 20% is designed for reach, featuring humor and
            relatable content to capture attention and increase awareness. By
            combining these two distinct content types, the plan is to capture
            our target audience with the broader attention-optimized content and
            then retain them and build community with the high-value branded
            content.
          </p>
          <p>
            <b>Boost BOF Winners With Paid:</b> We identify what organically
            performs best from the BOF batch, and boost those posts to the right
            demo. This lowers CAC and builds trust faster than a pure cold ad
            campaign.
          </p>
        </div>
      </div>
      <SocialAudit />
      <SeriesIdeas />
      <div className="flex flex-col gap-2 w-full max-w-[1000px]">
        <h2 className="text-2xl font-bold mt-10 flex items-center gap-2 text-[#0A5153]">
          <Target className="w-5 h-5" />
          The Goal
        </h2>

        <div className="flex flex-col gap-3 text-black bg-white p-4 rounded-md shadow-md border">
          <p>
            <b>Create Content That Resonates with our Target Demo:</b> The
            current content leans older—we’ll shift to reflect the voice, humor,
            and aesthetic of younger audience, especially students and socially
            conscious Gen Z. That means trend-aware visuals, relatable creators,
            and content that feels like a friend sent it.
          </p>
          <p>
            <b>Improve Bottom-of-Funnel Conversions:</b> Our priority is to turn
            awareness into real action—app installs, engagement, and retention.
            That means doubling down on content that directly explains what
            TreeCard is, why it matters, and how to get started. We want every
            post to build trust, spark curiosity, and push viewers to take the
            next step.
          </p>
          <p>
            <b>Reach 1M Views with BOF Content Per Month:</b> We’re setting a
            clear benchmark: 1 million monthly views from bottom-of-funnel (BOF)
            content across platforms. This ensures we’re consistently reaching
            high-intent viewers with messaging that drives action. We’ll use
            organic virality + paid boosting to scale what performs best.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 max-w-[1000px]">
        <h1 className="text-2xl font-bold mt-10 flex items-center gap-2 text-[#0A5153]">
          <Users className="w-5 h-5" />
          Our Service
        </h1>
        <div className="flex flex-col gap-3 text-black bg-white p-4 rounded-md shadow-md border">
          <p>
            • Strategy Development - We handle all aspects of content
            strategy—from ideation to execution—ensuring alignment with your
            brand goals, audience engagement, and industry trends.
          </p>
          <p>
            • Management of socials (community engagement (stories, comment
            replies), arranging collaborations, planning content, posting
            content)
          </p>
          <p>
            • Weekly reports (Micro breakdown - What worked, content pivots,
            insights and metrics)
          </p>
          <p>
            • Monthly reports (Macro breakdown - Last month&apos;s performance,
            strategy for the upcoming month, and any revisions to the current
            strategy. On a call or a video presentation. )
          </p>
          <p>• Month to Month contract (cancel anytime)</p>
        </div>
      </div>
    </div>
  );
};

export default Page;

const Arrow1 = ({...props}: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill="none"
      viewBox="0 0 243 236"
    >
      <g clipPath="url(#clip0_374_487)" opacity="1">
        <path d="M31.972 206.562a8.429 8.429 0 01-.394-5.722 108.646 108.646 0 013.266-11.07 157.197 157.197 0 019.542-22.703 4.055 4.055 0 014.174-.807 4.058 4.058 0 012.597 3.367 70.57 70.57 0 01-3.797 11.701c-1.544 3.968-4.196 12.443-5.712 17.49l.217-.073c.541-.252 2.354-.84 3.258-1.124 6.653-2.966 13.039-6.5 19.502-9.854 38.41-19.981 70.033-40.642 101.374-69.707a236.058 236.058 0 004.413-4.106c-10.331 4.164-20.604 8.471-30.898 12.726-3.203 1.318-6.416 2.617-9.682 3.774a10.333 10.333 0 01-6.422.858c-10.307-4.285 3.778-16.066 6.811-21.427a338.92 338.92 0 0030.713-45.62 172.783 172.783 0 0018.512-58.507 4.182 4.182 0 015.864-3.665c4.28 1.945 1.737 7.315 1.559 10.907a157.428 157.428 0 01-7.547 29.994 196.402 196.402 0 01-26.483 50.795c-6.354 9.186-13.439 17.86-20.026 26.874 12.878-4.734 29.048-12.39 43.096-17.263 3.567-1.481 10.117-2.764 10.105 2.923-.77 4.173-4.725 6.988-7.272 10.177a417.839 417.839 0 01-106.097 76.514c-6.66 3.766-17.99 8.999-23.075 11.073a234.315 234.315 0 0028.302 4.005 4.022 4.022 0 013.674 3.035 4.034 4.034 0 01-5.055 4.856c-10.76-.898-21.47-2.344-32.1-4.236a56.549 56.549 0 01-7.732-1.672 7.889 7.889 0 01-4.687-3.513zm97.868-76.111l-.008.003-.02.007.028-.01zm.172-.064c.73-.268.882-.332 0 0zm0 0l-.172.064.051-.018.121-.046z"></path>
      </g>
      <defs>
        <clipPath id="clip0_374_487">
          <path
            d="M0 0H252.316V85.835H0z"
            transform="rotate(136.764 108.918 79.34)"
          ></path>
        </clipPath>
      </defs>
    </svg>
  );
};
