import {UploadedVideo} from "@/config/data";
import {Icons} from "@/components/icons";

export const MediaListItem = ({
  file,
  isSelected,
  onSelect,
}: {
  file: UploadedVideo;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => {
  const fileType = file.title.split(".").pop();

  return (
    <button
      key={file.id}
      className={`flex items-center gap-2 p-2 w-full border group rounded-md  transition-all duration-300 relative ${
        file.needsRevision
          ? " hover:border-red-500 border-red-500 bg-red-500/10"
          : isSelected
          ? "bg-[#34F4AF]/10 border-[#34F4AF]"
          : " hover:border-[#34F4AF]/50 border-primary/10"
      }`}
      onClick={() => onSelect(file.id)}
    >
      <div className="flex items-center gap-2">
        {/* Type indicator */}
        <div className="w-10 h-10  border rounded-[6px] flex items-center justify-center">
          {fileType === "mov" || fileType === "mp4" ? (
            <Icons.video className="w-4 h-4" />
          ) : (
            <Icons.camera className="w-4 h-4" />
          )}
        </div>
        <div className="flex flex-col items-start">
          <h1 className="text-primary ">{file.title}</h1>
          <h1 className="text-primary/50 text-[12px]">
            {file?.size || "--"} mb
          </h1>
        </div>
      </div>
      {file.needsRevision && (
        <div className="flex items-center gap-2 ml-auto pr-4">
          <h1 className="text-primary/50 text-[12px] text-red-500">
            ( {file.revisionNotes} )
          </h1>
        </div>
      )}
      <Icons.chevronRight
        className={`w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 ${
          isSelected ? "block" : "hidden group-hover:block"
        }`}
      />
    </button>
  );
};
