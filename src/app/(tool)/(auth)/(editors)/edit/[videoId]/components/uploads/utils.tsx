import JSZip from "jszip";
import {UploadedVideo} from "@/config/data";

// Add UUID generation function
export function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const downloadAllFiles = async (files: UploadedVideo[]) => {
  const zip = new JSZip();

  // Wait for all fetch operations to complete
  await Promise.all(
    files.map(async (file) => {
      const response = await fetch(file.videoURL);
      const blob = await response.blob();

      // Determine file extension based on type
      let extension = ".mp4"; // Default for videos

      if (file.title.includes(".jpg") || file.title.includes(".jpeg")) {
        extension = ".jpg";
      } else if (file.title.includes(".png")) {
        extension = ".png";
      } else if (file.title.includes(".gif")) {
        extension = ".gif";
      } else if (file.title.includes(".webp")) {
        extension = ".webp";
      }

      zip.file(file.title + extension, blob);
    })
  );

  // Generate and download the zip
  const content = await zip.generateAsync({type: "blob"});
  const a = document.createElement("a");
  a.href = window.URL.createObjectURL(content);
  a.download = "media-files.zip";
  a.click();
  window.URL.revokeObjectURL(a.href);
};
