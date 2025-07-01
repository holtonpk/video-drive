"use client";
import Link from "next/link";
import {useState} from "react";
import {Icons} from "@/components/icons";
import localFont from "next/font/local";

const h1Font = localFont({
  src: "../fonts/HeadingNowTrial-56Bold.ttf",
});

const h2Font = localFont({
  src: "../fonts/HeadingNowTrial-55Medium.ttf",
});

const bodyFont = localFont({
  src: "../fonts/proximanova_light.otf",
});

export type FAQData = {
  id: number;
  question: string;
  answer: string;
}[];

export const FAQ = ({data}: {data: FAQData}) => {
  const [active, setActive] = useState<number | undefined>(undefined);

  return (
    <div className="bg-background text-primary py-40">
      <div className="container mx-auto grid grid-cols-2 gap-20">
        <div className="flex flex-col gap-4">
          <h1 className={`text-8xl uppercase ${h1Font.className}`}>
            Frequently Asked Questions
          </h1>
          <p className={`text-xl ${bodyFont.className}`}>
            Wondering how Ripple Media can make a difference for your
            organization? Here’s what people often ask us.
          </p>
          <Link
            href="/contact"
            className={`w-fit mt-10 flex gap-4 items-center bg-theme-color1 text-primary hover:ring-2 hover:ring-theme-color1 ring-offset-4 ring-offset-background py-2 px-6 rounded-full text-2xl ${h2Font.className}`}
          >
            Ask us questions
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {data.map((faq) => (
            <button
              key={faq.id}
              onClick={() =>
                active === faq.id ? setActive(undefined) : setActive(faq.id)
              }
              className="flex flex-col gap-4 bg-[#F6F6F6] p-6 rounded-[16px] border-2 border-transparent hover:border-primary/20 transition-all duration-300"
            >
              <h1
                className={`text-2xl flex items-center text-left  ${h2Font.className}`}
              >
                {faq.question}
                {active === faq.id ? (
                  <Icons.minus className="ml-auto w-6 h-6" />
                ) : (
                  <Icons.add className="ml-auto w-6 h-6" />
                )}
              </h1>
              {active === faq.id && (
                <p
                  className={`text-lg text-left text-primary/70 ${bodyFont.className}`}
                >
                  {faq.answer}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
