"use client";

import React, {useEffect} from "react";
import CreatePost from "./create-post";
import {BlogPost, blogCategories} from "@/config/data";
import Link from "next/link";
import {formatMonthDayYear} from "@/lib/utils";
import {LinkButton} from "@/components/ui/link";
import {set} from "date-fns";
import {Input} from "@/components/ui/input";
import {Icons} from "@/components/icons";
import {LucideProps} from "lucide-react";
import localFont from "next/font/local";

const bigFont = localFont({
  src: "../../fonts/HeadingNowTrial-56Bold.ttf",
});

const extraBigFont = localFont({
  src: "../../fonts/HeadingNowTrial-57Extrabold.ttf",
});

const h1Font = localFont({
  src: "../../fonts/HeadingNowTrial-56Bold.ttf",
});

const bodyFont = localFont({
  src: "../../fonts/proximanova_regular.ttf",
});

const bodyBold = localFont({
  src: "../../fonts/proximanova_bold.otf",
});

const h2Font = localFont({
  src: "../../fonts/HeadingNowTrial-55Medium.ttf",
});

const colors = ["#F51085", "#971EF7", "#1963F0", "#53E8B3"];

const BlogPageBody = ({posts}: {posts: BlogPost[]}) => {
  const [filter, setFilter] = React.useState("all");

  const [search, setSearch] = React.useState("");

  const filteredPosts = posts.filter((post) => {
    const filterUpper = filter.toLocaleUpperCase();
    const postCategoryUpper = post.category?.toLocaleUpperCase();
    const postTagsUpper = post.tags?.map((tag) => tag.toLocaleUpperCase());

    // Handle search logic
    if (search.length >= 3) {
      const searchUpper = search.toLocaleUpperCase();
      return (
        post.title.toLocaleUpperCase().includes(searchUpper) ||
        post.description.toLocaleUpperCase().includes(searchUpper)
      );
    }

    // Handle filter logic when search is not active
    if (filter === "all") return true;
    return (
      postCategoryUpper === filterUpper || postTagsUpper?.includes(filterUpper)
    );
  });

  const featuredPost = posts[posts.length - 1];

  return (
    <div className="mx-auto md:container mt-10 w-full pb-10  flex flex-col gap-4 ">
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-4 max-w-[800px] mx-auto items-center  p-10 rounded-[20px]">
          <div
            className={`bg-theme-color1 p-2 rounded-[8px] uppercase text-primary w-fit text-2xl -rotate-6 ${bigFont.className}`}
          >
            blog
          </div>
          <h1
            className={`text-8xl md:text-[110px] text-primary text-center uppercase ${extraBigFont.className}`}
          >
            The Content Lab
          </h1>
          <p
            className={`text-primary/70 text-center text-xl ${bodyFont.className}`}
          >
            We break down what’s working in the world of content, short-form
            video, and digital growth. From viral trends to platform algorithms,
            we share insights, experiments, and actionable tips to help brands,
            creators, and marketers make content that performs.
          </p>
          {/* <div className="grid grid-cols-[1fr_36px_1fr] items-center gap-4">
          <div className="w-full h-1 border-t border-[#C1C1C1] border-dashed"></div>
          <MailIcon className="w-10 h-10 text-primary" />
          <div className="w-full h-1 border-t border-[#C1C1C1] border-dashed"></div>
        </div>
        <h1 className="text-primary big-text text-2xl text-center">
          Get the latest insights to your inbox!
        </h1>
        <input
          type="email"
          placeholder="Enter Your Email"
          className="w-full p-2 bg-transparent rounded-[4px] text-primary py-4 text-2xl border-[#C1C1C1] border-2 text-center placeholder:text-[#454545]"
        />
        <p className="text-primary/70 small-text text-center">
          by signing up you agree to our{" "}
          <Link href="/privacy-policy" className="underline">
            privacy policy
          </Link>
        </p>
        <button className="bg-primary text-background  text-4xl rounded-full py-4 w-fit mx-auto px-8">
          Sign Up
        </button> */}
        </div>
        <Link
          href={`blog/${featuredPost.path}`}
          className="w-full relative rounded-[20px] overflow-hidden group"
        >
          <img
            src={featuredPost.image}
            alt="blog-page-image"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-background rounded-t-[20px] p-8 w-[80%] flex flex-col gap-2">
            <h1
              className={`text-primary text-2xl group-hover:underline text-center ${h2Font.className}`}
            >
              {featuredPost.title}
            </h1>
            <p
              className={`text-muted-foreground text-sm text-center ${bodyFont.className}`}
            >
              {featuredPost.description}
            </p>
          </div>
        </Link>
      </div>
      <div className="flex md:flex-row gap-4 flex-col w-fit justify-between mx-auto mt-8">
        <div className="w-full max-w-full flex-wrap flex items-center gap-4 order-3 md:order-1">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 text-primary   text-[20px]  font1 border-2  rounded-full hover:border-theme-color1 hover:ring-2 hover:ring-theme-color1 ring-offset-4 ring-offset-background ${
              h2Font.className
            } ${
              filter === "all"
                ? "bg-theme-color1  border-theme-color1 "
                : "border-[#EAEAEA] bg-transparent"
            }
          `}
          >
            All Posts
          </button>
          {blogCategories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2 text-primary   text-[20px]  font1 border-2  rounded-full hover:border-theme-color1 hover:ring-2 hover:ring-theme-color1 ring-offset-4 ring-offset-background ${
                h2Font.className
              } ${
                filter === category
                  ? "bg-theme-color1  border-theme-color1 "
                  : "border-[#EAEAEA] bg-transparent"
              }
          `}
            >
              {category}
            </button>
          ))}
        </div>
        {/* <div className="relative h-fit w-full md:w-[350px] order-1 md:order-3">
          <Icons.search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            placeholder="Search posts"
            className="w-full rounded-md p-2 bg-transparent text-primary pl-[30px]"
          />
        </div> */}
      </div>
      {filteredPosts && filteredPosts.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8 relative mt-10">
          {/* <div className="absolute top-0 w-2 h-[450px] bg-blue-600"></div> */}
          {filteredPosts.map((post) => (
            <PostCard post={post} key={post.id} />
          ))}
        </div>
      ) : (
        <div className="w-full h-[450px] flex flex-col items-center justify-center text-muted-foreground">
          <Icons.frown className="w-12 h-12 " />
          No posts found
        </div>
      )}
    </div>
  );
};

export default BlogPageBody;

const PostCard = ({post}: {post: BlogPost}) => {
  const desRef = React.useRef<HTMLParagraphElement>(null);
  const [isOverflown, setIsOverflown] = React.useState(true);

  useEffect(() => {
    if (desRef.current) {
      const des = desRef.current;
      if (des.clientHeight > 80) {
        setIsOverflown(true);
      } else {
        setIsOverflown(false);
      }
    }
  }, []);

  return (
    <Link
      href={`blog/${post.path}`}
      className="rounded-md w-full overflow-hidden group relative  "
    >
      <div className="w-full aspect-video relative z-10 rounded-[20px] overflow-hidden">
        <img
          src={post.image}
          alt="cover"
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-4 gap-2 h-fit flex flex-col">
        <h1
          className={` text-primary text-4xl group-hover:underline text-center ${bodyBold.className}`}
        >
          {post.title}
        </h1>
        <div className="relative h-fit overflow-hidden ">
          <p
            ref={desRef}
            className={`text-muted-foreground text-sm text-center ${bodyFont.className}`}
          >
            {post.description}
          </p>
        </div>
      </div>
    </Link>
  );
};

const MailIcon = ({...props}: LucideProps) => (
  <svg
    {...props}
    width="34"
    height="25"
    viewBox="0 0 34 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.33556 24.4395L32.9722 20.4148C33.3517 20.3615 33.6133 20.0143 33.56 19.6349L30.935 0.957294C30.8817 0.577844 30.5345 0.316195 30.155 0.369523L1.51837 4.39414C1.13892 4.44747 0.877276 4.79469 0.930604 5.17414L3.55556 23.8517C3.60889 24.2311 3.95611 24.4928 4.33556 24.4395ZM29.6634 1.8334L32.0961 19.1432L4.82722 22.9756L2.39449 5.6658L29.6634 1.8334Z"
      fill="black"
      stroke="black"
      stroke-width="0.3"
    ></path>
    <path
      d="M17.766 16.0586C17.6385 16.0765 17.5051 16.0519 17.3985 15.9716L1.33057 5.53504C1.08217 5.37064 1.00891 5.03433 1.1733 4.78592C1.33769 4.53752 1.67401 4.46426 1.92241 4.62865L17.5904 14.8095L29.8453 0.704349C30.0387 0.477855 30.3822 0.455578 30.6087 0.649046C30.8352 0.842514 30.8575 1.186 30.664 1.41249L18.0953 15.8737C18.0137 15.9718 17.8934 16.0407 17.766 16.0586Z"
      fill="black"
    ></path>
    <path
      d="M32.9534 20.2663C32.8259 20.2842 32.701 20.2584 32.5859 20.1793L20.5337 12.3585C20.2853 12.1941 20.212 11.8578 20.3764 11.6094C20.5408 11.361 20.8771 11.2877 21.1255 11.4521L33.1704 19.2826C33.4188 19.447 33.4921 19.7833 33.3277 20.0317C33.2424 20.165 33.1063 20.2448 32.9534 20.2663Z"
      fill="black"
    ></path>
    <path
      d="M4.31984 24.2909C4.16688 24.3124 4.01407 24.2732 3.88568 24.1612C3.65919 23.9678 3.63691 23.6243 3.83038 23.3978L13.2588 12.5495C13.4522 12.323 13.7957 12.3007 14.0222 12.4942C14.2487 12.6876 14.271 13.0311 14.0775 13.2576L4.65882 24.1132C4.56879 24.2125 4.4473 24.2729 4.31984 24.2909Z"
      fill="black"
    ></path>
  </svg>
);
