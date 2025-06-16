import {UploadedVideo} from "@/config/data";
import VideoPlayer from "@/components/ui/video-player";

export const MediaPlayer = ({file}: {file: UploadedVideo}) => {
  // get file type from file.name extension
  console.log("file title ========", file.title);

  const fileType = file.title.split(".").pop();
  console.log("fileType", fileType);

  if (fileType === "mov" || fileType === "mp4") {
    return <VideoView videoUrl={file.videoURL} />;
  } else if (
    fileType === "jpg" ||
    fileType === "jpeg" ||
    fileType === "png" ||
    fileType === "gif" ||
    fileType === ".webp"
  ) {
    return <ImageView imageUrl={file.videoURL} />;
  } else {
    console.warn(`Unknown file type: ${fileType} for file ${file.id}`);
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
        <p>Unsupported media type</p>
      </div>
    );
  }
};

const VideoView = ({videoUrl}: {videoUrl: string}) => (
  <div className="w-full md:w-[250px] mx-auto md:mx-0 aspect-[9/16] my-auto flex items-center justify-center bg-muted/10 overflow-hidden rounded-none  relative">
    {/* <video src={videoUrl} controls className="w-full h-full object-cover" /> */}
    <VideoPlayer
      videoUrl={videoUrl}
      title={videoUrl}
      className="rounded-none my-auto "
    />
  </div>
);

const ImageView = ({imageUrl}: {imageUrl: string}) => (
  <div className="w-full md:w-[200px] mx-auto md:mx-0 aspect-[9/16] bg-muted/10 overflow-hidden rounded-md  relative">
    <img
      src={imageUrl}
      alt="Media content"
      className="w-full h-full object-cover"
    />
  </div>
);
