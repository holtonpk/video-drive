import Image from "next/image";
import {Lightbulb, Brain, Goal} from "lucide-react";
import {Phone} from "lucide-react";
import Link from "next/link";
import {constructMetadata} from "@/lib/utils";
import {SeriesIdeas} from "./series-ideas";
import {Videos} from "./videos";
export const metadata = constructMetadata({
  title: "Godmode HQ Playbook",
  description: "A playbook for Godmode HQ",
});

const Page = () => {
  return (
    <div className="flex flex-col items-center px-4  md:container mx-auto gap-8 py-6">
      <Link
        href="https://calendly.com/holtonpk/30min"
        target="_blank"
        className="fixed bottom-4 right-4 bg-[#34F4AF] text-[#0f1115] px-4 py-2 rounded-md flex items-center z-[999]"
      >
        <Phone className="w-4 h-4 mr-2" />
        Let&apos;s chat
      </Link>
      <div className="flex flex-col items-center gap-2">
        <div className="h-16 w-16 rounded-md overflow-hidden">
          <Image
            src="/godmodehq_logo.jpeg"
            alt="Godmode HQ"
            width={100}
            height={100}
          />
        </div>
        <h1 className="text-4xl font-bold text-center text-[#34F4AF]">
          Godmode HQ social media playbook
        </h1>
        <p className="max-w-[500px] text-center">
          We&apos;ve developed this playbook to help you kickstart your social
          media journey. At the bottom of this page you will find 6 videos that
          we&apos;ve created to help you guys out.
        </p>
        <div className="flex flex-col gap-2 w-full">
          <h2 className="text-2xl font-bold mt-10 flex items-center gap-2 text-[#34F4AF]">
            <Brain className="w-5 h-5" />
            Our Thoughts
          </h2>
          <div className="flex flex-col gap-3">
            <p>
              - Sales, SMBs, and Founders are great niches for all platforms.
            </p>
            <p>
              - Although memes help with follower retention, the space is too
              saturated for fast growth. Unique custom content is king.
            </p>
            <p>
              - Avoid collaborations until you have a solid content base and at
              least 1,000 followers.
            </p>
            <p>
              - 80% TOF (Top of Funnel) content to grow a qualified audience.
            </p>
            <p>
              - 20% BOF (Bottom of Funnel) content to convert your audience into
              customers.
            </p>
          </div>
        </div>
        <SeriesIdeas />
        <Videos />
      </div>
    </div>
  );
};

export default Page;
