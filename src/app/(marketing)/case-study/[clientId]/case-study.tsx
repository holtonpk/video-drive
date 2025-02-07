import React from "react";
import {
  BlazeLogo,
  MortyLogo,
  FcLogo,
  YoutubeLogo,
  InstagramLogo,
  TiktokLogo,
  LearnXYZLogo,
  MindyLogo,
  FrizzleLogo,
  FcFlat,
  BlazeFlat,
  MortyFlat,
  Icons,
} from "@/components/icons";
import {ClientCard} from "../../components/use-cases";
import {LinkButton} from "@/components/ui/link";
const CaseStudy = ({clientId}: {clientId: string}) => {
  const clientData = ClientData.find((client) => client.clientId === clientId);

  return (
    <div className="flex flex-col  pb-10 gap-10 container items-center  h-fit">
      <div className="flex flex-col w-[90%] md:w-[70%] px-4 gap-2 mx-auto md:px-[2rem] relative md:container bg-black/40 border md:text-left tsext-center rounded-md  py-4 mt-12 ">
        <LinkButton
          href="/#"
          variant={"ghost"}
          className="rounded-[8px] w-fit  absolute  -top-2 px-0  -translate-y-full left-0  hover:bg-transparent hover:opacity-70"
        >
          <Icons.chevronLeft className="h-6 w-6" />
          Back to home page
        </LinkButton>
        <div className="flex flex-col gap-2 items-center">
          <div className="flex flex-col  gap-2 items-center justify-center">
            {clientData && (
              <clientData.icon className="h-12 w-12 rounded-[12px]" />
            )}

            <h1 className="text-5xl font1-bold ">{clientData?.name}</h1>
          </div>
          <p className="text-xl font1 text-center">
            {clientData?.clientDescription}
          </p>
        </div>
      </div>
      <div className="w-[90%] md:w-[70%]  gap-8 mx-auto  relative flex flex-col">
        <div className="flex flex-col gap-2 items-start">
          <h1 className="text-3xl font1-bold text-[#F51085] text-left">
            The Challenge
          </h1>
          <p className="text-xl font1  text-left">{clientData?.challenge}</p>
        </div>
        <div className="flex flex-col gap-2 ">
          <h1 className="text-3xl font1-bold text-[#971EF7] text-left">
            Our Solution
          </h1>
          <p className="text-xl font1 text-left">{clientData?.solution}</p>
        </div>
        <div className="flex flex-col gap-2 ">
          <h1 className="text-3xl font1-bold text-[#1963F0] text-left">
            The Outcome
          </h1>
          <p className="text-xl font1 text-left">{clientData?.outcome}</p>
        </div>
        <h1 className="text-4xl font1-bold mt-8 text-center md:text-left">
          More Case Studies
        </h1>
        <div className="grid md:grid-cols-2 gap-10 w-full">
          {ClientData.map((client) => (
            <>
              {client.clientId !== clientId && (
                <ClientCard
                  key={client.clientId}
                  name={client.name}
                  clientDescription={client.clientDescription}
                  logo={<client.flatIcon />}
                  id={client.clientId}
                />
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseStudy;

const ClientData = [
  {
    icon: BlazeLogo,
    flatIcon: BlazeFlat,
    name: "Blaze Ai",
    clientId: "blaze",
    clientDescription:
      "Blaze uses AI to help small and medium businesses create custom content that feels true to their brand. Whether it’s social media posts, blogs, newsletters, or even websites, Blaze makes sure everything matches your style and voice. It’s an easy way to save time and create content that connects with your audience.",
    challenge:
      "The team was looking for a way to scale up their organic reach with short-form content to grow Blaze’s community and engage viewers. The challenge was creating content that worked well with algorithms while still connecting with their audience.",
    solution: `
Partnered with Blaze to supercharge their presence across all short-form content platforms. \n
Developed platform-specific scripts, optimized and repurposed existing content, and tapped into trending formats across channels like TikTok, Instagram Reels, and YouTube Shorts.
\n
Highlighted Blaze’s offerings and mission through engaging, tailored content designed to boost reach, engagement, and audience retention.
`,
    outcome:
      "Within a year, we generated millions of views across multiple platforms and grew Blaze’s follower count from just 5,000 to over 100,000—all through organic content. ",
  },
  {
    icon: MortyLogo,
    flatIcon: MortyFlat,
    name: "Morty",
    clientId: "morty",
    clientDescription:
      "Morty is a free app that helps you find, track, and review immersive attractions from all over the world. Whether it’s a mind-blowing experience in a strip mall or a warehouse-turned-wonderland, Morty brings it all together in one place. It’s an easy way to explore the best immersive experiences out there and stay connected with a global community.",
    challenge:
      "The Morty team was looking for a way to scale their organic reach and build a community around immersive attractions. Their challenge was crafting content that balanced algorithm-friendly strategies while capturing the excitement and curiosity of those passionate about unique, immersive experiences.",
    solution: `
We collaborated with Morty to elevate their presence on all short-form content platforms.\n
Our approach involved creating original, engaging content that tapped into the thrill and wonder of immersive attractions. We crafted compelling narratives, spotlighting unique experiences and bringing them to life through captivating visuals. 
\n
By embracing viral trends and formats across TikTok, Instagram Reels, and YouTube Shorts, we ensured Morty’s content resonated with both adventure enthusiasts and casual explorers alike.

`,
    outcome:
      "Morty saw a steady increase in both reach and engagement. Their follower count grew significantly, with a notable uptick in community interaction and content shares. Additionally, the insights gained from the organic content helped shape and refine their paid ads strategy, allowing them to target their ideal audience more effectively.",
  },
  {
    icon: FcLogo,
    flatIcon: FcFlat,
    name: "Founder Central",
    clientId: "founderCentral",
    clientDescription:
      "Founder Central is a media company dedicated to showcasing the success stories of the most inspiring founders and uncovering emerging business opportunities. Targeted at the Gen Z audience, they define themselves as the #1 place for future billionaires, offering insights and inspiration to the next wave of entrepreneurs",
    challenge:
      "Founder Central wanted to grow its audience and solidify its position as the go-to platform for Gen Z entrepreneurs and aspiring billionaires. The challenge was to create content that would resonate with this audience while promoting the success stories of founders and business opportunities in an authentic, relatable way. They needed a strategy to amplify their message and connect with an audience that’s both highly engaged and fiercely independent.",
    solution: `
We partnered with Founder Central to develop a tailored content strategy that would appeal directly to Gen Z.\n
By creating short-form videos, engaging social media posts, and inspiring founder interviews, we highlighted the stories of successful entrepreneurs and shared valuable business insights. We used trending formats on platforms like TikTok, Instagram Reels, and YouTube Shorts to ensure that Founder Central’s content reached its audience in the most engaging way possible.\n
We also integrated community-driven content by featuring user-submitted success stories, fostering a sense of belonging and engagement among viewers.


`,
    outcome:
      "Founder Central’s community grew rapidly, with a significant increase in followers and engagement across their platforms. Their Instagram account reached 50,000 followers in just 4 months and continues to grow, reflecting the brand’s growing influence among Gen Z entrepreneurs.",
  },
];
