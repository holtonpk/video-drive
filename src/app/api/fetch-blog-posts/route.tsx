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
    const collectionRef = collection(db, "blog");
    const docRef = query(collectionRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(docRef);
    const posts: BlogPost[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push(data as BlogPost);
    });
    return NextResponse.json({
      posts,
    });
  } catch (error) {
    console.log("error =========", error);
    return NextResponse.json({
      response: error,
    });
  }
}
