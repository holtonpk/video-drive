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

export async function GET(req: NextApiRequest) {
  const docsQuery = query(collection(db, "videos"), orderBy("dueDate", "desc"));
  const querySnapshot = await getDocs(docsQuery);
  const videos: Video[] = [];
  querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
    videos.push(doc.data() as Video);
  });

  return Response.json(videos);
}
