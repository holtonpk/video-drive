import React from "react";
import {useVideo} from "../data/video-context";
import {Icons} from "@/components/icons";
import {Button, buttonVariants} from "@/components/ui/button";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import {AssetType} from "@/src/app/(tool)/(auth)/(admin)/new-video/new-video-context";
import edjsHTML from "editorjs-html";
import {OutputData} from "@editorjs/editorjs";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Highlighter} from "lucide-react";

const Requirements = () => {
  const {video} = useVideo()!;

  const [scriptCopied, setScriptCopied] = React.useState(false);

  const copyScript = () => {
    if (!video.script) return;
    if (typeof video.script !== "string") {
      const edjsParser = edjsHTML();
      const htmlList = edjsParser.parse(video.script);
      const html = htmlList.join("");
      const rawText = html.replace(/<[^>]*>?/g, "");
      navigator.clipboard.writeText(rawText);
    } else {
      navigator.clipboard.writeText(video.script);
    }

    setScriptCopied(true);
    setTimeout(() => {
      setScriptCopied(false);
    }, 2000);
  };

  const [selectedHighlightColor, setSelectedHighlightColor] =
    React.useState("#ffeb3b");

  return (
    <div className="grid grid-rows-[auto_1fr] gap-0 h-full flex-grow border rounded-md">
      <div className="flex items-center text-primary  bg-muted/50  p-2 rounded-t-md ">
        <Icons.script className="mr-2 h-4 w-4" />
        <Label>Script</Label>
        <div className="flex gap-2 ml-auto">
          <Button size="sm" onClick={copyScript} variant="outline">
            {scriptCopied ? (
              <>
                <Icons.check className="mr-2 h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Icons.copy className="mr-2 h-4 w-4" />
                Copy to clipboard
              </>
            )}
          </Button>
        </div>
      </div>
      {typeof video.script === "string" ? (
        <div className="h-full  bg-foreground/40 blurBack overflow-scroll w-full  text-primary  editor-js-view flex flex-col gap-4 ">
          {video.script}
        </div>
      ) : (
        <EditorJsRender
          script={video.script!}
          selectedHighlightColor={selectedHighlightColor}
          setSelectedHighlightColor={setSelectedHighlightColor}
        />
      )}
    </div>
  );
};

const EditorJsRender = ({
  script,
  selectedHighlightColor,
  setSelectedHighlightColor,
}: {
  script: OutputData;
  selectedHighlightColor: string;
  setSelectedHighlightColor: (color: string) => void;
}) => {
  const edjsParser = edjsHTML();
  const htmlList = edjsParser.parse(script);
  const html = htmlList.join("");

  const [highlights, setHighlights] = React.useState<
    Array<{
      id: string;
      text: string;
      color: string;
      start: number;
      end: number;
    }>
  >([]);

  const [selectedText, setSelectedText] = React.useState<string>("");
  const [selectionRange, setSelectionRange] = React.useState<Range | null>(
    null
  );

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) {
      setSelectedText("");
      setSelectionRange(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedTextContent = selection.toString();

    if (selectedTextContent.trim().length > 0) {
      setSelectedText(selectedTextContent);
      setSelectionRange(range.cloneRange());
    }
  };

  const handleSelect = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) {
      setSelectedText("");
      setSelectionRange(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedTextContent = selection.toString();

    if (selectedTextContent.trim().length > 0) {
      setSelectedText(selectedTextContent);
      setSelectionRange(range.cloneRange());

      // Add visual selection indicator
      addSelectionIndicator(range);
    }
  };

  const addSelectionIndicator = (range: Range) => {
    // Remove any existing selection indicators
    const existingIndicators = document.querySelectorAll(
      ".selection-indicator"
    );
    existingIndicators.forEach((indicator) => indicator.remove());

    const container = document.querySelector(".editor-js-view");
    if (!container) return;

    // Get the selected text
    const selectedText = range.toString();
    if (!selectedText.trim()) return;

    console.log("Creating selection indicator for:", selectedText);

    // Use the same approach as highlights - wrap text in a span
    // Use the browser's default selection color (blue)
    const selectionSpan = `<span class="selection-indicator" style="background-color: rgba(59, 130, 246, 0.8); color: white; padding: 1px 2px; border-radius: 2px;">${selectedText}</span>`;

    // Find and replace the text in the container
    const containerHTML = container.innerHTML;
    const updatedHTML = containerHTML.replace(selectedText, selectionSpan);

    // Update the container
    container.innerHTML = updatedHTML;

    console.log("Created selection indicator using highlight approach");
  };

  const applyHighlight = (color: string) => {
    console.log("applyHighlight called with:", {
      color,
      selectedText,
      selectionRange,
    });

    if (!selectedText || !selectionRange) {
      console.log("No selection available");
      return;
    }

    // Create a new highlight with the current selection
    const newHighlight = {
      id: Date.now().toString(),
      text: selectedText,
      color: color,
      start: 0, // We'll calculate this differently
      end: selectedText.length,
    };

    console.log("Adding new highlight:", newHighlight);
    setHighlights((prev) => [...prev, newHighlight]);

    // Keep the selection active - don't clear it
    // The user can continue to apply different colors or deselect manually
  };

  const removeHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  const renderHighlightedText = () => {
    let highlightedHtml = html;

    // Apply highlights by wrapping text in spans
    if (highlights.length > 0) {
      // Sort highlights by start position (reverse order to avoid offset issues)
      const sortedHighlights = [...highlights].sort(
        (a, b) => b.start - a.start
      );

      sortedHighlights.forEach((highlight) => {
        // Find the text in the HTML and wrap it with a highlight span
        const textToHighlight = highlight.text;
        const highlightSpan = `<span class="highlight" data-highlight-color="${highlight.color}" data-highlight-id="${highlight.id}">${textToHighlight}</span>`;

        // Replace the text with the highlighted version
        highlightedHtml = highlightedHtml.replace(
          textToHighlight,
          highlightSpan
        );
      });
    }

    // Note: Selection indicator will be added via CSS overlay

    return (
      <div
        dangerouslySetInnerHTML={{__html: highlightedHtml}}
        className="h-fit overflow-scroll w-full max-h-[300px] text-primary bg-muted/20 blurBack p-4 rounded-b-md editor-js-view flex flex-col gap-4 pb-10"
        onMouseUp={handleMouseUp}
        onSelect={handleSelect}
        style={{
          userSelect: "text",
          WebkitUserSelect: "text",
          MozUserSelect: "text",
          msUserSelect: "text",
        }}
      />
    );
  };

  return (
    <div className="relative h-full">
      {/* CSS for highlights */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .highlight {
            background-color: var(--highlight-color);
            padding: 0px 0px;
            border-radius: 3px;
            margin: 0 0px;
            position: relative;
            z-index: 1;
          }
          .highlight[data-highlight-color="#ffeb3b"] { --highlight-color: #ffeb3b; }
          .highlight[data-highlight-color="#ff9800"] { --highlight-color: #ff9800; }
          .highlight[data-highlight-color="#f44336"] { --highlight-color: #f44336; }
          .highlight[data-highlight-color="#e91e63"] { --highlight-color: #e91e63; }
          .highlight[data-highlight-color="#9c27b0"] { --highlight-color: #9c27b0; }
          .highlight[data-highlight-color="#673ab7"] { --highlight-color: #673ab7; }
          .highlight[data-highlight-color="#3f51b5"] { --highlight-color: #3f51b5; }
          .highlight[data-highlight-color="#2196f3"] { --highlight-color: #2196f3; }
          .highlight[data-highlight-color="#00bcd4"] { --highlight-color: #00bcd4; }
          .highlight[data-highlight-color="#4caf50"] { --highlight-color: #4caf50; }
          
          /* Ensure text selection works with highlights */
          .editor-js-view {
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
            user-select: text;
          }
          
          /* Make highlights work with text selection */
          .highlight::selection {
            background-color: rgba(59, 130, 246, 0.5) !important;
          }
          .highlight::-moz-selection {
            background-color: rgba(59, 130, 246, 0.5) !important;
          }
          
          /* Custom selection indicator */
          .editor-js-view::selection {
            background-color: rgba(59, 130, 246, 0.8) !important;
            color: white !important;
          }
          .editor-js-view::-moz-selection {
            background-color: rgba(59, 130, 246, 0.8) !important;
            color: white !important;
          }
          
          /* Ensure text selection is visible */
          .editor-js-view *::selection {
            background-color: rgba(59, 130, 246, 0.8) !important;
            color: white !important;
          }
          .editor-js-view *::-moz-selection {
            background-color: rgba(59, 130, 246, 0.8) !important;
            color: white !important;
          }
          
          /* Selection indicator styling */
          .editor-js-view {
            position: relative;
          }
          
          .selection-indicator {
            /* Styles are applied inline, this is just for any additional CSS */
          }
        `,
        }}
      />

      {/* Color picker and controls */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        {selectedText && (
          <>
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
              ✓ "{selectedText.substring(0, 20)}
              {selectedText.length > 20 ? "..." : ""}" selected
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setSelectedText("");
                setSelectionRange(null);
                const selection = window.getSelection();
                if (selection) {
                  selection.removeAllRanges();
                }
                // Remove selection indicators by restoring original HTML
                const container = document.querySelector(".editor-js-view");
                if (container) {
                  // Remove the selection indicator spans
                  const selectionSpans = container.querySelectorAll(
                    ".selection-indicator"
                  );
                  selectionSpans.forEach((span) => {
                    // Replace the span with just its text content
                    const textContent = span.textContent || "";
                    span.parentNode?.replaceChild(
                      document.createTextNode(textContent),
                      span
                    );
                  });
                }
              }}
              className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
            >
              Clear
            </Button>
          </>
        )}
        <HighlightColorPicker
          selectedHighlightColor={selectedHighlightColor}
          setSelectedHighlightColor={setSelectedHighlightColor}
          applyHighlight={applyHighlight}
        />
      </div>

      {/* Highlighted text */}
      {renderHighlightedText()}

      {/* Highlights list */}
      {/* {highlights.length > 0 && (
        <div className="absolute bottom-2 left-2 right-2 bg-background border rounded-md p-2 shadow-lg max-h-24 overflow-y-auto">
          <Label className="text-xs mb-2 block">Highlights:</Label>
          <div className="flex flex-wrap gap-1">
            {highlights.map((highlight) => (
              <div
                key={highlight.id}
                className="flex items-center gap-1 bg-muted rounded px-0 py-1 text-xs"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{backgroundColor: highlight.color}}
                />
                <span className="max-w-20 truncate">{highlight.text}</span>
                <button
                  onClick={() => removeHighlight(highlight.id)}
                  className="text-muted-foreground hover:text-foreground ml-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
};

const HighlightColorPicker = ({
  selectedHighlightColor,
  setSelectedHighlightColor,
  applyHighlight,
}: {
  selectedHighlightColor: string;
  setSelectedHighlightColor: (color: string) => void;
  applyHighlight: (color: string) => void;
}) => {
  const [open, setOpen] = React.useState(false);

  const colors = [
    "#ffeb3b", // Yellow
    "#ff9800", // Orange
    "#f44336", // Red
    "#e91e63", // Pink
    "#9c27b0", // Purple
    "#673ab7", // Deep Purple
    "#3f51b5", // Indigo
    "#2196f3", // Blue
    "#00bcd4", // Cyan
    "#4caf50", // Green
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border border-muted"
              style={{backgroundColor: selectedHighlightColor}}
            />
            <Highlighter className="h-4 w-4" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-3">
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setSelectedHighlightColor(color);
                  applyHighlight(color);
                  setOpen(false);
                }}
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                  selectedHighlightColor === color
                    ? "border-foreground scale-110"
                    : "border-muted hover:border-foreground/50"
                )}
                style={{backgroundColor: color}}
                title={`Select ${color}`}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Requirements;

const AssetRow = ({asset}: {asset: AssetType}) => {
  const downloadFile = async (file: AssetType) => {
    setIsDownloading(true);
    try {
      const response = await fetch(file.url);
      if (!response.ok) {
        throw new Error(
          `Network response was not ok, status: ${response.status}`
        );
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = file.title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
    setIsDownloading(false);
  };

  const [isDownloading, setIsDownloading] = React.useState(false);

  return (
    <div
      key={asset.title}
      className="w-full text-primary border rounded-md p-4 grid grid-cols-[1fr_150px]  items-center justify-between gap-4"
    >
      <h1 className="max-w-full text-ellipsis whitespace-nowrap overflow-hidden">
        {asset.title + ".mp3"}
      </h1>
      <div className="flex gap-4 items-center  w-full">
        <Link
          href={asset.url}
          target="_blank"
          className={cn(buttonVariants({variant: "outline"}))}
        >
          Open
        </Link>

        <Button onClick={() => downloadFile(asset)}>
          {isDownloading ? (
            <Icons.loader className="ml-auto h-5 w-5 animate-spin" />
          ) : (
            <Icons.download className="ml-auto h-5 w-5 " />
          )}
        </Button>
      </div>
    </div>
  );
};
