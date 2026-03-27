import {notFound, permanentRedirect} from "next/navigation";
import {NavBar} from "../../../navbar";
import {Footer} from "../../../footer";
import {constructMetadata} from "@/lib/utils";
import {baseSlugFromName, isNumericPostIdParam} from "@/lib/slug";
import VideoPage from "./video-page";
import {
  getLaunchLibraryVideoByPostId,
  getLaunchLibraryVideoBySlug,
  getLaunchLibraryVideos,
} from "../../data/get-launch-video";

type Props = {
  params: Promise<{slug: string}>;
};

export async function generateMetadata({params}: Props) {
  const {slug: rawSlug} = await params;
  const slug = decodeURIComponent(rawSlug).trim();

  let video = null;

  if (isNumericPostIdParam(slug)) {
    video = await getLaunchLibraryVideoByPostId(slug);
  } else {
    video = await getLaunchLibraryVideoBySlug(slug);
  }

  if (!video) {
    return constructMetadata({
      title: "Video not found — Launch Library",
      description: "Launch library video",
    });
  }

  return constructMetadata({
    title: `${video.name} — Launch Library`,
    description: video.description ?? video.commentary ?? "YC launch video",
  });
}

export default async function Page({params}: Props) {
  const {slug: rawSlug} = await params;
  const slug = decodeURIComponent(rawSlug).trim();

  if (isNumericPostIdParam(slug)) {
    const byId = await getLaunchLibraryVideoByPostId(slug);

    if (byId) {
      const canonical = byId.slug?.trim() || baseSlugFromName(byId.name);
      permanentRedirect(`/launch-library/${canonical}`);
    }

    notFound();
  }

  const [video, allVideos] = await Promise.all([
    getLaunchLibraryVideoBySlug(slug),
    getLaunchLibraryVideos(),
  ]);

  if (!video) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <VideoPage video={video} allVideos={allVideos} />
      <Footer />
    </div>
  );
}
