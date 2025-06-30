import React from "react";
import {ContactForm} from "./contact-form";
import {NavBar} from "../navbar";
import {Smile} from "../icons";
import {constructMetadata} from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Ripple Media - Contact Us",
  description:
    "We're here to help you with any questions or concerns you may have. Please fill out the form below and we'll get back to you as soon as possible.",
});

const Page = () => {
  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="container grid md:grid-cols-2 gap-10 py-16 min-h-screen">
        <div className="flex flex-col gap-4">
          <div className="p-2 border-2 border-theme-color1 rounded-[8px] big-text-bold w-fit text-3xl -rotate-6">
            Contact
          </div>
          <h1 className="text-10xl font-bold big-text-bold">
            Let's Work{" "}
            <span className=" text-theme-color3 flex items-center">
              Together
              <Smile className="w-28 h-28 fill-theme-color1 hover:rotate-12 transition-all duration-300 ml-4" />
            </span>
          </h1>
          <p className="text-lg small-text text-primary/70">
            We're here to help you with any questions or concerns you may have.
            Please fill out the form below and we'll get back to you as soon as
            possible.
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
};

export default Page;
