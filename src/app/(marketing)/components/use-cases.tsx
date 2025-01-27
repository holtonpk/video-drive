import React from "react";
import {Icons, BlazeFlat, FcFlat, MortyFlat} from "@/components/icons";
import Link from "next/link";

const UseCases = () => {
  return (
    <div>
      <h1 className="capitalize text-4xl text-center font1-bold mt-20 mb-10">
        A few of our success stories
      </h1>

      <div className="grid  md:grid-cols-3 gap-8 container">
        <ClientCard
          name="Blaze"
          description="Blaze uses AI to help small and medium businesses create custom content that feels true to their brand. Whether it’s social media posts, blogs, newsletters, or even websites, Blaze makes sure everything matches your style and voice. It’s an easy way to save time and create content that connects with your audience."
          logo={<BlazeFlat className="b-b w-full h-auto" />}
          id="blaze"
        />

        <ClientCard
          name="Morty"
          description="Morty is a free app that helps you find, track, and review immersive attractions from all over the world. Whether it’s a mind-blowing experience in a strip mall or a warehouse-turned-wonderland, Morty brings it all together in one place. It’s an easy way to explore the best immersive experiences out there and stay connected with a global community."
          logo={<MortyFlat />}
          id="morty"
        />

        <ClientCard
          name="Founder Central"
          description="Founder Central is a media company dedicated to showcasing the success stories of the most inspiring founders and uncovering emerging business opportunities. Targeted at the Gen Z audience, they define themselves as the #1 place for future billionaires, offering insights and inspiration to the next wave of entrepreneurs"
          logo={<FcFlat />}
          id="founderCentral"
        />
      </div>
    </div>
  );
};

export default UseCases;

export const ClientCard = ({
  name,
  description,
  logo,
  id,
}: {
  name: string;
  description: string;
  logo: React.ReactNode;
  id: string;
}) => {
  return (
    <Link
      href={`/case-study/${id}`}
      className="w-ful flex flex-col border bg-black/40 blurBack rounded-lg overflow-hidden"
    >
      <div className="w-full relative aspect-video bg-[#34F4AF] flex items-center justify-center p-8">
        {logo}
      </div>
      <div className="flex flex-col p-4">
        <h1 className="font1-bold text-3xl s">{name}</h1>
        <div className="h-[56px] overflow-hidden s">
          <p className="font1 text-lg text-ellipsis line-clamp-2">
            {description}
          </p>
        </div>
        <button className="flex items-center gap-4 underline font1-bold group">
          <span className="group-hover:text-[#34F4AF] transition-all duration-300">
            Read more
          </span>
          <div className="h-7 w-7 rounded-full bg-[#34F4AF] flex items-center justify-center">
            <Icons.arrowRight className="text-background -rotate-[25deg] group-hover:mb-1 group-hover:ml-1 transition-all duration-300 h-4 w-4" />
          </div>
        </button>
      </div>
    </Link>
  );
};
