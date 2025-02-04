import React from "react";
import Background from "@/src/app/(marketing)/components/background";
import {Icons, Logo, AmLogo} from "@/components/icons";
import Link from "next/link";
import {LinkButton} from "@/components/ui/link";
import Image from "next/image";
import {IncomingMessage} from "http";
import {constructMetadata} from "@/lib/utils";

export const metadata = constructMetadata({
  title: "@AttentionMarketers - Links",
  description: "Get a free custom content plan for your business",
});

const Page = () => {
  return (
    <div className="dark flex flex-col h-fit min-h-screen ">
      <Background />
      <div className=" mx-auto  flex flex-col  overflow-hidden w-screen max-w-[400px] px-4 mt-6 pb-4 items-center gap-4">
        <div className="flex flex-col gap-2 items-center ">
          <AmLogo className="h-20 w-20" />

          <h1 className="font1-bold text-3xl text-center">
            Attention Marketers
          </h1>
          <p className="font1 text-lg text-muted-foreground">
            @AttentionMarketers
          </p>
          <div className="flex flex-row gap-2 items-center">
            <Link
              href="mailto:team@ripple-media.co"
              className="border-2 border-white h-10 w-10 rounded-full flex items-center justify-center"
            >
              <Icons.mail className="" />
            </Link>
            <Link
              href="/#"
              className="border-2 border-white h-10 w-10 rounded-full flex items-center justify-center"
            >
              <Icons.link2 className="" />
            </Link>
            {/* <Link
              href="https://www.linkedin.com/in/adamholton1/"
              className="border-2 border-white h-10 w-10 rounded-full flex items-center justify-center"
            >
              <Icons.linkedin className="" />
            </Link> */}
          </div>
        </div>
        <div className="border rounded-md border-white p-4 gap-4 flex flex-col items-center">
          <div className="w-full relative">
            <Image
              width={0}
              height={0}
              sizes="100vw"
              style={{width: "100%", height: "auto"}} // optional
              alt="demo"
              src="/demo.png"
              className="w-full max-w-[800px]"
              priority
            />
          </div>
          <p className="font1 text-lg text-center">
            Get Your Free Personalized Social Media Content Plan ...in under 30
            seconds.
          </p>
          <Link
            className="bg-[#34F4AF] w-full font1-bold rounded-md flex items-center justify-center py-2 text-[#1A191E] hover:bg-[#34F4AF]/90 hover:-translate-y-[2px] transition-all duration-300"
            href={"/content-plan"}
          >
            Get my plan
          </Link>
        </div>
        <h2 className="text-xl font1-bold  w-full text-center rounded-md ">
          Our Agency
        </h2>
        <div className="border rounded-md border-white p-4 gap-4 flex flex-col ">
          <div className="flex gap-4 items-center">
            <div className="rounded-[12px] h-16 w-16 aspect-square bg-[#1A191E] p-3 border border-[#34F4AF]">
              <Logo className="" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="font1 text-xl">Ripple Media</h1>
              <p className="text-sm">
                We help scale tech tools with organic short form content
              </p>
            </div>
          </div>
          <Link
            className="bg-[#34F4AF] w-full font1-bold rounded-md flex items-center justify-center py-2 text-[#1A191E] hover:bg-[#34F4AF]/90 hover:-translate-y-[2px] transition-all duration-300"
            href={"/#"}
          >
            Let&apos;s work together
          </Link>
        </div>
      </div>
      <div className="flex w-full items-center justify-center text-muted gap-2 mt-auto mb-4">
        <Link className="text-muted  font1-bold" href={"/legal/privacy"}>
          Privacy Policy
        </Link>
        <div className="h-1 w-1 rounded-full bg-muted"></div>
        <Link className="text-muted  font1-bold" href={"/legal/terms"}>
          Terms
        </Link>
      </div>
    </div>
  );
};

export default Page;
