"use client";
import Link from "next/link";
import {useState} from "react";
import {Icons} from "@/components/icons";

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
          <h1 className="big-text-bold text-8xl">Frequently Asked Questions</h1>
          <p className="text-xl small-text">
            Wondering how Ripple Media can make a difference for your
            organization? Here’s what people often ask us.
          </p>
          <Link
            href="/contact"
            className="w-fit mt-10 flex gap-4 items-center bg-theme-color1 text-primary hover:ring-2 hover:ring-theme-color1 ring-offset-4 ring-offset-background py-2 px-6 rounded-full big-text text-3xl"
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
              <h1 className="big-text text-3xl flex items-center text-left  ">
                {faq.question}
                {active === faq.id ? (
                  <Icons.minus className="ml-auto w-6 h-6" />
                ) : (
                  <Icons.add className="ml-auto w-6 h-6" />
                )}
              </h1>
              {active === faq.id && (
                <p className="text-lg small-text text-left text-primary/70">
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
