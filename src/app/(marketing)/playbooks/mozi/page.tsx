import Image from "next/image";
import {Lightbulb, Brain, Goal, Users} from "lucide-react";
import {Phone} from "lucide-react";
import Link from "next/link";
import {constructMetadata} from "@/lib/utils";
import {SeriesIdeas} from "./series-ideas";

export const metadata = constructMetadata({
  title: "Mozi app Playbook",
  description: "A playbook for Mozi app",
});

const Page = () => {
  return (
    <div className="flex flex-col items-center px-4 bg-[#F5F2F0]  md:container mx-auto gap-8 py-6">
      {/* <Link
        href="https://calendly.com/holtonpk/30min"
        target="_blank"
        className="fixed bottom-4 right-4 bg-[#FF5501] text-[#0f1115] px-4 py-2 rounded-md flex items-center z-[999]"
      >
        <Phone className="w-4 h-4 mr-2" />
        Let&apos;s chat
      </Link> */}
      <div className="flex flex-col items-center gap-2">
        <div className="h-16 w-16 rounded-md overflow-hidden shadow-md">
          <Image src="/mozi_logo.jpeg" alt="Mozi" width={100} height={100} />
        </div>
        <h1 className="text-4xl font-bold text-center text-[#FF5501]">
          Mozi social media playbook
        </h1>
        <p className="max-w-[500px] text-center text-black">
          We&apos;ve developed this playbook to help you kickstart your social
          media growth.
        </p>
        <div className="flex flex-col gap-2 w-full max-w-[1000px]">
          <h2 className="text-2xl font-bold mt-10 flex items-center gap-2 text-[#FF5501]">
            <Brain className="w-5 h-5" />
            Our Thoughts
          </h2>
          <div className="flex flex-col gap-3 text-black bg-white p-4 rounded-md shadow-md">
            <p>
              Mozi thrives on creating real-world connections, making social
              media the ideal platform to engage with community-oriented
              individuals who seek meaningful social interactions.
            </p>
            <p>
              The message resonates best through dynamic, storytelling-driven
              video content that captures the emotions and real-life moments of
              spontaneous social plans.
            </p>
            <p className="font-bold">Strategic Content Allocation</p>

            <p>
              •80% TOF (Top of Funnel) content to grow a qualified audience.
            </p>
            <p>
              •20% BOF (Bottom of Funnel) content to convert your audience into
              customers.
            </p>
          </div>
        </div>
        <SeriesIdeas />
        <div className="flex flex-col gap-2 max-w-[1000px]">
          <h1 className="text-2xl font-bold mt-10 flex items-center gap-2 text-[#FF5501]">
            <Users className="w-5 h-5" />
            Collaborations
          </h1>
          <div className="flex flex-col gap-3 text-black">
            <p>
              Full list of collaborators{" "}
              <Link
                className="text-[#FF5501] hover:underline"
                href="https://docs.google.com/spreadsheets/d/1Uoym4U8v5fhNKfmINurdkAYg3kEydDqnfD3WeYFBDmI/edit?gid=0#gid=0"
                target="_blank"
              >
                here
              </Link>
              . Collaborations are broken into 3 categories:
            </p>
            <div className="grid grid-cols-3  gap-4">
              <div className="flex flex-col gap-1 border rounded-md p-4 border-black/10 bg-white shadow-md h-fit">
                <h1 className="text-lg font-bold text-[#FF5501]">
                  Local Communities
                </h1>
                <p className="text-black/80">
                  Business pages and groups that are local communities
                </p>
                <p>•Run Clubs</p>
                <p>•Bars</p>
                <p>•Coffee shops</p>
                <p>•Yoga Studios</p>
                <p>•Board game cafes</p>
                <p>•Coworking spaces</p>
                <p>•Climbing Gyms</p>
                <p>•Theater & Improv Groups</p>
                <p>•Martial art studios</p>
              </div>
              <div className="flex flex-col gap-1 border rounded-md p-4 border-black/10 bg-white shadow-md h-fit">
                <h1 className="text-lg font-bold text-[#FF5501]">Travel</h1>
                <p className="  text-black/80">
                  Influencers and accounts that are relevant to the travel niche
                </p>
                <p>•Travel influencers</p>
                <p>•Travel Theme pages</p>
              </div>
              <div className="flex flex-col gap-1 border rounded-md p-4 border-black/10 bg-white shadow-md h-fit">
                <h1 className="text-lg font-bold text-[#FF5501]">
                  Shared Message
                </h1>
                <p className="text-black/80">
                  Creators with shared message (Get off the screen and start
                  living)
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 max-w-[1000px]">
          <h1 className="text-2xl font-bold mt-10 flex items-center gap-2 text-[#FF5501]">
            <Users className="w-5 h-5" />
            Our Service
          </h1>
          <div className="flex flex-col gap-3 text-black bg-white p-4 rounded-md shadow-md">
            <p>
              • 5 Short form videos per week (Posted on Instagram, Youtube, and
              Tiktok)
            </p>
            <p>
              • Our team at your disposal (Have a new feature or announcement?
              Have an idea for a video?)
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
              • Monthly reports (Macro breakdown - Last month&apos;s
              performance, strategy for the upcoming month, and any revisions to
              the current strategy. On a call or a video presentation. )
            </p>
            <p>• Month to Month contract (cancel anytime)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
