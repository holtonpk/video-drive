"use client";
import React, {useEffect} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {setDoc, getDoc, doc} from "firebase/firestore";
import {db} from "@/config/firebase";
import {EDITORS} from "@/config/data";
import {UserData} from "@/context/user-auth";

export const EditorSelector = ({
  selectEditor,
  selectedEditor,
}: {
  selectEditor: (value: string) => void;
  selectedEditor: string;
}) => {
  const [editor, setEditor] = React.useState<string | undefined>(
    selectedEditor
  );
  const [editors, setEditors] = React.useState<UserData[] | undefined>();

  useEffect(() => {
    const fetchEditors = async () => {
      try {
        const editorPromises = EDITORS.map(async (editor) => {
          const dataSnap = await getDoc(doc(db, "users", editor));
          return dataSnap.data() as UserData;
        });

        const editorData = await Promise.all(editorPromises);
        setEditors(editorData);
      } catch (error) {
        console.error("Error fetching editor data: ", error);
      }
    };

    fetchEditors();
  }, []);

  return (
    <>
      {editors && editors.length > 0 && (
        <Select
          value={editor}
          onValueChange={(value) => {
            setEditor(value);
            selectEditor(value);
          }}
        >
          <SelectTrigger
            id="editor"
            className=" truncate w-[200px] mt-4 mx-auto"
          >
            <SelectValue placeholder="Select an editor" />
          </SelectTrigger>
          <SelectContent className="bg-background text-foreground">
            {editors.map((option) => (
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
                  <span className="text-foreground">{option.firstName}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </>
  );
};
