import React, {useEffect} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import {VideoData, EDITORS} from "@/config/data";

import {db} from "@/config/firebase";
import {doc, getDoc} from "firebase/firestore";
import {NewVideo} from "../create-videos";
import {UserData} from "@/context/user-auth";

export const PersonSelector = ({
  peopleIDs,
  selectedPerson,
  setNewVideos,
  newVideos,
  video,
  label,
  field,
  errors,
  onValueChange,
  peopleData,
}: {
  peopleIDs: string[];
  selectedPerson: string | undefined;
  setNewVideos: (videos: NewVideo[]) => void;
  newVideos: NewVideo[];
  video: NewVideo;
  label: string;
  field: string;
  errors: string[];
  onValueChange: (value: string) => void;
  peopleData: UserData[] | undefined;
}) => {
  const [person, setPerson] = React.useState<string | undefined>(
    selectedPerson
  );

  useEffect(() => {
    console.log("selectedPerson", selectedPerson);
    setPerson(selectedPerson);
  }, [selectedPerson]);

  return (
    <>
      {peopleData && peopleData.length > 0 && (
        <Select
          value={person}
          onValueChange={(value) => {
            setPerson(value);
            setNewVideos(
              newVideos.map((v) => {
                if (v.videoNumber === video.videoNumber) {
                  return {...v, [field]: value};
                }
                return v;
              })
            );
            onValueChange(value);
          }}
        >
          <SelectTrigger
            id="editor"
            className={`${
              errors.find((e) => e === field) && "border-red-500"
            } truncate w-full`}
          >
            <SelectValue placeholder={`Select a ${label}`} />
          </SelectTrigger>
          <SelectContent>
            {peopleData.map((option) => (
              <SelectItem
                key={option.uid}
                value={option.uid}
                className="flex flex-nowrap"
              >
                <div className="flex items-center">
                  <img
                    src={option.photoURL}
                    alt="editor"
                    className="h-6 w-6 rounded-full mr-2"
                  />
                  <span>{option.firstName}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </>
  );
};
