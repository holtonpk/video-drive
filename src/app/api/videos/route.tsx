import {NextApiRequest} from "next";
import {db} from "@/config/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import {Video} from "@/src/app/video-sheet/data/schema";

export async function GET() {
  const docsQuery = query(collection(db, "videos"), orderBy("dueDate", "desc"));
  const querySnapshot = await getDocs(docsQuery);
  const videos: Video[] = [];
  querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
    videos.push(doc.data() as Video);
  });

  const headers = new Headers();
  headers.set("Cache-Control", "no-store, max-age=0");
  return new Response(JSON.stringify(videos), {
    headers: headers,
    status: 200, // HTTP status code
  });
}
