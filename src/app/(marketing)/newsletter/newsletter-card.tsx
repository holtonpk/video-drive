"use client";

import Link from "next/link";
import React from "react";
import localFont from "next/font/local";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {emailSchema, type EmailFormData} from "@/lib/validations/email";
import {db} from "@/config/firebase";
import {collection, addDoc, serverTimestamp} from "firebase/firestore";
import {toast} from "sonner";

const h1Font = localFont({
  src: "../fonts/HeadingNowTrial-57Extrabold.ttf",
});

const h2Font = localFont({
  src: "../fonts/HeadingNowTrial-56Bold.ttf",
});

const bodyFont = localFont({
  src: "../fonts/proximanova_light.otf",
});

const bodyBoldFont = localFont({
  src: "../fonts/proximanova_bold.otf",
});

export const NewsletterCard = () => {
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    reset,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: EmailFormData) => {
    try {
      // Save email and timestamp to Firebase emailList1 collection
      await addDoc(collection(db, "emailList1"), {
        email: data.email,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString(),
      });

      // Show success toast
      toast("🎉 Welcome to The Content Vault!");

      console.log("Email saved successfully:", data.email);
      // Reset form after successful submission
      reset();
    } catch (error) {
      console.error("Error saving email:", error);

      // Show error toast
      toast("❌ Subscription Failed");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-10 md:mt-20 max-w-[500px] mx-auto    bg-background">
      <div
        className={`p-2 bg-theme-color1 text-primary rounded-[8px] uppercase -rotate-[10deg] ${h1Font.className}`}
      >
        Newsletter
      </div>
      <h1
        className={`text-7xl md:text-8xl font-bold text-primary text-center ${h1Font.className}`}
      >
        The Content Vault
      </h1>

      <p
        className={` text-center text-lg text-primary/60 ${bodyFont.className}`}
      >
        Get the Latest Trends and Insights Delivered straight to Your Inbox
      </p>
      <div className="grid items-center grid-cols-[1fr_34px_1fr] gap-4 w-full">
        <div className="w-full h-1 border-b border-dashed border-primary/30" />
        <MailIcon />
        <div className="w-full h-1 border-b border-dashed border-primary/30" />
      </div>
      <form
        id="newsletter-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full"
      >
        <div className="flex flex-col gap-2">
          {errors.email && (
            <div
              className={`w-full bg-red-500/30 rounded-[8px] text-red-500 p-2 flex items-center justify-center ${bodyBoldFont.className}`}
            >
              {errors.email.message}
            </div>
          )}
          <input
            {...register("email")}
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 rounded-[8px] border border-primary/40 bg-background focus:outline-none focus:outline-0  text-primary focus:ring-2 focus:border-theme-color3 ring-theme-color3 ring-offset-4 ring-offset-background transition-all duration-300  "
          />
        </div>
      </form>

      <button
        type="submit"
        form="newsletter-form"
        disabled={isSubmitting}
        className={`flex bg-theme-color3 rounded-full text-primary uppercase w-full justify-center items-center text-xl px-8 py-2 hover:ring-2  ring-theme-color3 ring-offset-4 dark:ring-offset-background ring-offset-background transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${h1Font.className}`}
      >
        {isSubmitting ? "Signing Up..." : "Sign Up"}
      </button>
      <p
        className={`text-sm text-primary/40 text-center ${bodyFont.className}`}
      >
        By subscribing, you agree to our{" "}
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/terms" className="underline">
          Terms of Service
        </Link>
        .
      </p>
    </div>
  );
};

const MailIcon = () => {
  return (
    <svg
      width="34"
      height="25"
      fill="none"
      viewBox="0 0 34 25"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="#000">
        <path
          d="m4.33556 24.4395 28.63664-4.0247c.3795-.0533.6411-.4005.5878-.7799l-2.625-18.677606c-.0533-.37945-.4005-.641099-.78-.587771l-28.63663 4.024617c-.37945.05333-.641094.40055-.587766.78l2.624956 18.67756c.05333.3794.40055.6411.78.5878zm25.32784-22.6061 2.4327 17.3098-27.26888 3.8324-2.43273-17.3098z"
          stroke="#000"
          stroke-width=".3"
        ></path>
        <path d="m17.766 16.0586c-.1275.0179-.2609-.0067-.3675-.087l-16.06793-10.43656c-.2484-.1644-.32166-.50071-.15727-.74912.16439-.2484.50071-.32166.74911-.15727l15.66799 10.18085 12.2549-14.105151c.1934-.226494.5369-.248771.7634-.055303s.2488.536954.0553.763444l-12.5687 14.46121c-.0816.0981-.2019.167-.3293.1849z"></path>
        <path d="m32.9534 20.2663c-.1275.0179-.2524-.0079-.3675-.087l-12.0522-7.8208c-.2484-.1644-.3217-.5007-.1573-.7491s.5007-.3217.7491-.1573l12.0449 7.8305c.2484.1644.3217.5007.1573.7491-.0853.1333-.2214.2131-.3743.2346z"></path>
        <path d="m4.31984 24.2909c-.15296.0215-.30577-.0177-.43416-.1297-.22649-.1934-.24877-.5369-.0553-.7634l9.42842-10.8483c.1934-.2265.5369-.2488.7634-.0553.2265.1934.2488.5369.0553.7634l-9.41868 10.8556c-.09003.0993-.21152.1597-.33898.1777z"></path>
      </g>
    </svg>
  );
};
