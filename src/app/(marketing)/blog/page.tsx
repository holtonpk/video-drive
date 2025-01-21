import Background from "@/src/app/(marketing)/components/background";
import Navbar from "@/src/app/(marketing)/components/navbar";
import Footer from "@/src/app/(marketing)/components/footer";
import {Metadata} from "next";
import BlogPageBody from "@/src/app/(marketing)/blog/components/blog-page";
import {BlogPost} from "@/config/data";
import {notFound} from "next/navigation";

export const generateMetadata = (): Metadata => {
  return {
    title: `Ripple Media| Blog`,
    description:
      "Read out latest thoughts and insights on the world of tech tool marketing",
    icons: {
      icon: "image/favicon.ico",
      shortcut: "image/favicon-16x16.png",
      apple: "image/apple-touch-icon.png",
    },
  };
};

export default async function Page() {
  const postData = await getPosts();

  console.log("postData", postData);

  return (
    <div className="dark flex flex-col h-fit min-h-screen">
      <Background />
      <div className="   min-w-screen   flex flex-col  overflow-hidden">
        <Navbar show={true} />
      </div>
      <BlogPageBody posts={postData} />
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

// async function getPosts() {
//   // Call an external API endpoint to get posts
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_SITE_URL}/api/fetch-blog-posts`,
//     {
//       cache: "no-cache",
//     }
//   );
//   const posts = await res.json();

//   const postsData: BlogPost[] = posts.posts;

//   if (!postsData) notFound();
//   return postsData;
// }

async function getPosts() {
  // Call an external API endpoint to get posts
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/fetch-blog-posts`,
      {
        cache: "no-cache",
      }
    );
    const posts = await res.json();

    const postsData: BlogPost[] = posts.posts;
    return postsData;
  } catch (error) {
    console.error("Error fetching blog posts===:", error);
    return []; // Handle the case where fetch fails
  }
}
