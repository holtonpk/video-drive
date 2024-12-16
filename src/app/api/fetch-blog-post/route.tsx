import {NextResponse} from "next/server";
import {db} from "@/config/firebase";
import {doc, getDocs, query, collection, where} from "firebase/firestore";

export async function POST(req: Request) {
  const {blogPath} = await req.json();

  try {
    // fetch doc with field path equal to blogId
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
