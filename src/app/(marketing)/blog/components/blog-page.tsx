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

  return (
    <div className="mx-auto md:container mt-[80px] md:mt-[110px] mb-40 w-[90%] md:w-[70%] flex flex-col gap-4">
      <div className="flex md:flex-row gap-4 flex-col w-full justify-between">
        <div className="w-full max-w-full flex-wrap flex items-center gap-4 order-3 md:order-1">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1 rounded-sm font1 border transition-colors duration-300
          ${
            filter === "all"
              ? "bg-primary text-background"
              : " bg-transparent text-primary hover:bg-primary hover:text-background"
          }
          `}
          >
            All Posts
          </button>
          {blogCategories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-1 rounded-sm font1 border transition-colors duration-300
          ${
            filter === category
              ? "bg-primary text-background"
              : " bg-transparent text-primary hover:bg-primary hover:text-background"
          }
          `}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="relative h-fit w-full md:w-[350px] order-1 md:order-3">
          <Icons.search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            placeholder="Search posts"
            className="w-full rounded-md p-2 bg-transparent text-primary pl-[30px]"
          />
        </div>
      </div>
      {filteredPosts && filteredPosts.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-8 relative">
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
      <div className="w-full p-4 bg-black/40 border mt-10 md:mt-20 rounded-sm  items-center flex flex-col text-center px-8 md:px-16 py-8 gap-2">
        <h1 className="text-2xl font1-bold">
          Learn how Ripple Media can help transform your startup
        </h1>
        <p className="text-sm text-muted-foreground">
          Running a startup is hard. Our teams have the experience and expertise
          to help you grow. Lets get in touch and discuss how we can help you
        </p>

        <LinkButton
          href="/work-with-us"
          className="mt-4 w-full px-4 text-base hover:bg-[#34F4AF]/80 bg-[#34F4AF] text-background font1-bold rounded-md py-2"
        >
          Apply now
        </LinkButton>
        {/* <div className="w-full relative mt-2">
        <Input
          type="email"
          placeholder="Email address"
          className="w-full rounded-md p-2"
        />
        <button className="absolute right-0 top-0 h-full px-4 bg-[#34F4AF] text-background font1-bold rounded-r-md">
          Subscribe
        </button>
      </div> */}
      </div>
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
      className="border rounded-md w-full overflow-hidden group relative  bg-black/40"
    >
      <div className="absolute top-2 font1-bold text-sm py-1 left-2 z-20 rounded-[4px] px-4 border bg-black/40 blurBack">
        {formatMonthDayYear(post.createdAt)}
      </div>
      <div className="w-full aspect-video relative z-10">
        <img src={post.image} alt="cover" className="object-cover" />
      </div>
      <div className="p-4 h-fit flex flex-col">
        <h1 className="font1-bold group-hover:underline">{post.title}</h1>
        <div className="relative h-[80px] overflow-hidden ">
          <p ref={desRef} className="text-muted-foreground text-sm">
            {post.description}
          </p>
          {isOverflown && (
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#0C0D0E] via-[#0C0D0E]/70 to-transparent" />
          )}
        </div>
        <div className=" w-full md:w-fit justify-start flex-wrap gap-2  h-fit flex mt-2 ">
          {post.tags &&
            post.tags.map((tag, index) => (
              <p
                key={index}
                className="text-[12px] border capitalize px-2 py-1 rounded-md h-fit whitespace-nowrap"
                style={{
                  borderColor: colors[index % colors.length],
                  color: colors[index % colors.length],
                }}
              >
                {tag}
              </p>
            ))}
          {post.length && (
            <p
              className="text-[12px] border  px-2 py-1 rounded-md h-fit"
              style={{
                borderColor: colors[post.tags ? post.tags.length : 3],
                color: colors[post.tags ? post.tags.length : 3],
              }}
            >
              {post.length} minute read
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
