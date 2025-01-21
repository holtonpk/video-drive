import {NextResponse} from "next/server";
import {db} from "@/config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import {BlogPost} from "@/config/data";

export async function GET() {
  try {
    // fetch all blog posts
    // const collectionRef = collection(db, "blog");
    // const docRef = query(collectionRef, orderBy("createdAt", "desc"));
    // const querySnapshot = await getDocs(docRef);
    // const posts: BlogPost[] = [];
    // querySnapshot.forEach((doc) => {
    //   const data = doc.data();

    //   posts.push(data as BlogPost);
    // });

    return NextResponse.json({
      posts: postDataHard,
    });
  } catch (error) {
    console.log("error =========", error);
    return NextResponse.json({
      response: error,
    });
  }
}

const postDataHard = [
  {
    tags: ["marketing", "social media", "startups"],
    published: false,
    updatedAt: {seconds: 1734330200, nanoseconds: 386000000},
    path: "consumers-have-smaller-attention-spans-than-goldfish-how-to-win-at-marketing",
    author: {
      name: "Adam Holton",
      id: "x9h3UepduwQHoCkwUh7bPGqEeTj2",
      avatar:
        "https://lh3.googleusercontent.com/a/ACg8ocLamLj6u8Uclu3ysiE8A9FAgW9m0PFP7HJqJe637_VTQJQfdT8l=s96-c",
    },
    createdAt: {seconds: 1734323052, nanoseconds: 89000000},
    content: {version: "2.29.1", time: 1734330200177, blocks: [Array]},
    description:
      "In today’s 8-second attention economy, capturing consumer focus is harder than ever, with social media and short-form video dominating the digital landscape. Platforms like TikTok, Instagram Reels, and YouTube Shorts offer startups a cost-effective way to compete, delivering high ROI with creative, engaging content. To stay relevant and thrive, businesses must act now to leverage these tools and connect authentically with audiences.",
    id: "kN4mJuWXJuR0q8sVhF0o",
    image:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/video-concepts%2Fpatty_a_dark_green_blue_purple_pink_neon_style_illustration_o_b157dab4-c9a8-42b3-9c9b-21e1f67bcec4_2.png?alt=media&token=57acb587-5f0f-4f15-810a-54712070ab22",
    title:
      "Consumers have smaller attention spans than Goldfish: How to Win at Marketing",
    length: 5,
    category: "Marketing",
  },
  {
    tags: ["social media", "short form video", "marketing"],
    content: {version: "2.29.1", time: 1734329275020, blocks: [Array]},
    length: 10,
    updatedAt: {seconds: 1734329275, nanoseconds: 722000000},
    published: false,
    id: "a9X8Paar3GltBg9ALy3W",
    category: "Marketing",
    createdAt: {seconds: 1734074000, nanoseconds: 699000000},
    description:
      "Discover the tools and knowledge you need to create a data-driven social media marketing strategy that propels your brand to new heights of success, capturing attention and driving engagement in today's competitive digital landscape. Leverage the power of short-form video and actionable insights to connect authentically with your audience and achieve measurable results.",
    path: "the-ultimate-guide-to-crafting-a-winning-social-media-marketing-strategy",
    title:
      "The Ultimate Guide to Crafting a Winning Social Media Marketing Strategy",
    image:
      "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/video-concepts%2Fpatty_a_dark_green_blue_purple_pink_neon_style_illustration_o_454573bb-142b-424a-98bb-11a870d69729_1.png?alt=media&token=68b10403-faa6-48e4-aa5f-48608e05b129",
    author: {id: "team", avatar: "logo", name: "Whitespace Team"},
  },
];
