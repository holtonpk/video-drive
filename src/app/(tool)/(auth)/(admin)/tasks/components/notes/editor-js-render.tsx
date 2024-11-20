"use client";

import React, {use, useEffect, useState} from "react";
import {Icons} from "@/components/icons";

import {OutputData} from "@editorjs/editorjs";
import edjsHTML from "editorjs-html";

export const EditorJsRender = ({
  script,
  onUpdate,
}: {
  script: OutputData;
  onUpdate?: (updatedData: OutputData) => void;
}) => {
  // State for checklist blocks
  const [blocks, setBlocks] = useState(script.blocks);

  useEffect(() => {
    if (blocks !== script.blocks) {
      setBlocks(script.blocks);
    }
  }, [script]);

  // Function to update a specific item's checked state

  const toggleItemChecked = (blockID: number, itemIndex: number) => {
    console.log("blockID", blockID, itemIndex);
    const updatedBlocks = [...blocks];
    const targetBlock: any = updatedBlocks.find(
      (block: any) => block.id === blockID
    );

    if (targetBlock.type === "checklist") {
      const targetItem = targetBlock.data.items[itemIndex];
      targetItem.checked = !targetItem.checked; // Toggle the checked state
    }
    setBlocks(updatedBlocks);

    if (onUpdate) {
      onUpdate({...script, blocks: updatedBlocks});
    }
  };

  const checklistParser = (block: any) => {
    const blockId = block.id;
    return (
      <div key={blockId} className="grid gap-4 ml-[1.5em]">
        {block.data.items.map((item: any, itemIndex: any) => (
          <div
            key={itemIndex}
            className="grid grid-cols-[16px_1fr] gap-2 items-start"
          >
            <div
              className={`h-4 w-4 border rounded-[4px] relative flex mt-1 items-center justify-center hover:bg-primary/30 transition-colors duration-300 ${
                item.checked ? "bg-primary" : "bg-background"
              }`}
              onClick={() => toggleItemChecked(blockId, itemIndex)}
            >
              {item.checked && (
                <Icons.check className="h-4 w-4 text-background" />
              )}
            </div>
            <p
              className={`text-base ${
                item.checked
                  ? " text-primary/80 line-through decoration-primary/40"
                  : ""
              }`}
            >
              {item.text.replaceAll(/&nbsp;/g, " ")}
            </p>
          </div>
        ))}
      </div>
    );
  };

  // Initialize editorjs-html with the checklist parser
  const edjsParser = edjsHTML({
    checklist: (block: any) => {
      // Return a placeholder since checklist blocks are rendered directly
      return `<div data-react-checklist-id="${block.id}"></div>`;
    },
  });

  // Render the blocks
  return (
    <div id="notes-view">
      {blocks.map((block) => {
        if (block.type === "checklist") {
          // Render checklist blocks dynamically
          return checklistParser(block);
        } else {
          // Parse and render other blocks using edjsHTML
          const html = edjsParser.parse({blocks: [block]});
          console.log("html", html);
          return (
            <div
              key={block.id}
              dangerouslySetInnerHTML={{
                __html: html.join(""),
              }}
            />
          );
        }
      })}
    </div>
  );
};

export const EditorJsToHtml = (outputData: OutputData) => {
  console.log("outputData", outputData);

  // Custom parser for checklist blocks
  const checklistParser = (block: any) => {
    console.log("block ===", block);
    return `
      <div style="display: grid; gap: 16px;">
  ${block.data.items
    .map(
      (item: any) => `
  <table style="border-collapse: collapse; width: 100%; margin: 0; padding: 0;">
    <tr>
      <td style="width: 16px; vertical-align: top;">
        <div style="height: 16px; width: 16px; border: 1px solid black; border-radius: 4px; position: relative; background-color: ${
          item.checked ? "black" : "white"
        }; text-align: center;">
          ${
            item.checked
              ? '<span style="height: 16px; width: 16px; color: white; display: inline-block; line-height: 16px;">✔</span>'
              : ""
          }
        </div>
      </td>
      <td style="vertical-align: top; padding-left: 8px;">
        <p style="font-size: 16px; margin: 0; ${
          item.checked ? "text-decoration: line-through;" : ""
        }">
          ${item.text}
        </p>
      </td>
    </tr>
  </table>
`
    )
    .join("")}
</div>
      `;
  };

  // Initialize edjsHTML with a custom parser for checklist blocks
  const edjsParser = edjsHTML({checklist: checklistParser});

  // Check if blocks exist
  if (!outputData || !outputData.blocks || !Array.isArray(outputData.blocks)) {
    throw new Error("Invalid outputData: blocks array is required.");
  }

  // Parse the blocks and combine the output
  const htmlArray = edjsParser.parse(outputData);

  // Join the parsed blocks into a single HTML string
  return htmlArray.join("");
};
