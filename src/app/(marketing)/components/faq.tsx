"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/app/(marketing)/components/ui/accordion";

export function Faq() {
  const questions = [
    {
      q: "Who is this for?",
      a: "Our services are designed for brands and businesses looking to elevate their presence on social media through engaging short-form videos. Whether you're a startup aiming to establish your brand identity, an established company seeking to connect with a younger audience, or anyone in between, our expertise in crafting attention-grabbing content can help drive sustainable brand awareness for your organization. We cater to those who understand the power of social media and are ready to leverage it to its fullest potential.",
    },
    {
      q: "Why should I invest in short form content?",
      a: "Investing in short-form content is essential for capturing attention in today's fast-paced digital landscape. Its concise format boosts engagement, particularly on mobile platforms, and maximizes brand visibility across various social media channels. With its cost-effectiveness and adaptability, short-form content offers a powerful means to drive brand awareness and connect with your audience effectively.",
    },
    {
      q: "Why choose Ripple Media?",
      a: "Our young, dynamic team understands the pulse of the new generation, delivering content tailored to engage and resonate with today's audiences. Whether extracting clips from long-form content or creating original, attention-grabbing videos, we're committed to helping your brand stand out in the digital sphere.",
    },
    {
      q: "What can I expect from you guys?",
      a: "We'll deliver 20 engaging posts monthly, handle comment replies, and curate captivating story content. Our systematic approach ensures efficiency at every step, from content creation to scheduling and engagement monitoring. This streamlined processes guarantee a seamless experience, allowing you to focus on other aspects of your business while we elevate your brand's online presence. ",
    },
  ];

  return (
    <div className="flex gap-4 md:gap-10 relative container items-starts flex-col md:flex-row  mb-20">
      <h1 className="text-5xl mx-auto md:ml-auto md:text-8xl font1-bold text-[#53E8B3] text-left">
        Frequently <br />
        Asked <br /> Questions.
      </h1>
      <Accordion
        type="single"
        collapsible
        className="w-full bg-black/40 border blurBack rounded-xl p-4 md:p-6"
      >
        {questions.map((question, index) => (
          <AccordionItem key={index} value={question.q}>
            <AccordionTrigger className="font-bold font1 md:text-2xl text-left data-[state=open]:text-[#53E8B3] hover:text-[#53E8B3] transition-colors duration-300">
              {question.q}
            </AccordionTrigger>
            <AccordionContent className=" md:text-lg font1 text-white">
              {question.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
