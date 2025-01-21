import {NextResponse} from "next/server";
import {db} from "@/config/firebase";
import {doc, getDocs, query, collection, where} from "firebase/firestore";

export async function POST(req: Request) {
  const {blogPath} = await req.json();

  try {
    // fetch doc with field path equal to blogId
    return NextResponse.json({
      response: {
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
    });
    const docQuery = query(
      collection(db, "blog"),
      where("path", "==", blogPath)
    );
    const querySnapshot = await getDocs(docQuery);
    const docSnap = querySnapshot.docs[0];
    // const docRef = doc(db, "blog", blogId);
    // const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return NextResponse.json({
        response: docSnap.data(),
      });
    } else {
      return NextResponse.json({
        response: "No such document!",
      });
    }
  } catch (error) {
    console.log("error =========", error);
    return NextResponse.json({
      response: error,
    });
  }
}
