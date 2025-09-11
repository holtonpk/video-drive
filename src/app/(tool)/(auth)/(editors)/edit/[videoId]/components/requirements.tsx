// --- EditorJsRender.tsx ---
import React from "react";
import edjsHTML from "editorjs-html";
import {OutputData} from "@editorjs/editorjs";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Highlighter, Eraser} from "lucide-react";
import {cn} from "@/lib/utils";

type HL = {id: string; start: number; end: number; color: string};

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
  const html = React.useMemo(() => edjsParser.parse(script).join(""), [script]);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const baseHtmlRef = React.useRef<string>(""); // pristine html
  const [highlights, setHighlights] = React.useState<HL[]>([]);
  const [selectionOffsets, setSelectionOffsets] = React.useState<{
    start: number;
    end: number;
  } | null>(null);

  // Render initial HTML once
  React.useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = html;
    baseHtmlRef.current = html;
    // Ensure selectable
    containerRef.current.style.userSelect = "text";
  }, [html]);

  // Utility: collect text nodes in-order
  const getTextNodes = React.useCallback(() => {
    const nodes: {node: Text; start: number; end: number}[] = [];
    if (!containerRef.current) return nodes;
    const walker = document.createTreeWalker(
      containerRef.current,
      NodeFilter.SHOW_TEXT,
      null
    );
    let n: Node | null;
    let offset = 0;
    while ((n = walker.nextNode())) {
      const t = n as Text;
      const len = t.nodeValue?.length ?? 0;
      if (len > 0) {
        nodes.push({node: t, start: offset, end: offset + len});
        offset += len;
      }
    }
    return nodes;
  }, []);

  // Compute absolute offsets for a DOM Range relative to the container
  const offsetsFromRange = React.useCallback(
    (range: Range): {start: number; end: number} | null => {
      const textNodes = getTextNodes();
      if (textNodes.length === 0) return null;

      const findOffset = (container: Node, node: Node, nodeOffset: number) => {
        let total = 0;
        for (const tn of textNodes) {
          if (tn.node === node) {
            return total + nodeOffset;
          }
          total = tn.end;
        }
        // If target wasn't a pure text node (e.g. element), try to anchor to closest text position
        // Fallback: clamp to bounds
        return Math.max(0, Math.min(total, total));
      };

      // Normalize to text nodes when possible
      let startNode = range.startContainer;
      let startOffset = range.startOffset;
      let endNode = range.endContainer;
      let endOffset = range.endOffset;

      // If start/end containers are elements, try to push into nearest text node
      if (startNode.nodeType !== Node.TEXT_NODE) {
        // try to descend to the first text node in that subtree
        const walker = document.createTreeWalker(
          startNode,
          NodeFilter.SHOW_TEXT,
          null
        );
        const firstText = walker.nextNode() as Text | null;
        if (firstText) {
          startNode = firstText;
          startOffset = 0;
        }
      }
      if (endNode.nodeType !== Node.TEXT_NODE) {
        const walker = document.createTreeWalker(
          endNode,
          NodeFilter.SHOW_TEXT,
          null
        );
        // walk to last text node
        let lastText: Text | null = null;
        let cur: Node | null;
        while ((cur = walker.nextNode())) lastText = cur as Text;
        if (lastText) {
          endNode = lastText;
          endOffset = lastText.nodeValue?.length ?? 0;
        }
      }

      const absStart = findOffset(
        containerRef.current!,
        startNode,
        startOffset
      );
      const absEnd = findOffset(containerRef.current!, endNode, endOffset);
      const s = Math.max(0, Math.min(absStart, absEnd));
      const e = Math.max(0, Math.max(absStart, absEnd));
      if (e <= s) return null;
      return {start: s, end: e};
    },
    [getTextNodes]
  );

  // Mouse selection handlers
  const captureSelection = React.useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !containerRef.current) {
      setSelectionOffsets(null);
      return;
    }
    const range = sel.getRangeAt(0);
    if (!containerRef.current.contains(range.commonAncestorContainer)) {
      setSelectionOffsets(null);
      return;
    }
    const off = offsetsFromRange(range);
    setSelectionOffsets(off && off.end > off.start ? off : null);
  }, [offsetsFromRange]);

  // Subtract one range from another list of ranges (used for overrides/removals)
  const subtractRange = (items: HL[], sub: {start: number; end: number}) => {
    const out: HL[] = [];
    for (const h of items) {
      // no overlap
      if (sub.end <= h.start || sub.start >= h.end) {
        out.push(h);
        continue;
      }
      // overlap cases -> split
      if (sub.start > h.start) {
        out.push({...h, end: sub.start});
      }
      if (sub.end < h.end) {
        out.push({...h, start: sub.end});
      }
    }
    return out;
  };

  // Merge adjacent same-color ranges
  const mergeRanges = (items: HL[]) => {
    const a = [...items].sort((x, y) => x.start - y.start || x.end - y.end);
    const out: HL[] = [];
    for (const r of a) {
      const last = out[out.length - 1];
      if (last && last.color === r.color && r.start <= last.end) {
        last.end = Math.max(last.end, r.end);
      } else {
        out.push({...r});
      }
    }
    return out;
  };

  // Apply highlight (override any existing in selection)
  const applyHighlight = (color: string) => {
    if (!selectionOffsets) return;
    const id = `${Date.now()}`;
    const cleaned = subtractRange(highlights, selectionOffsets); // override
    const next = mergeRanges([
      ...cleaned,
      {id, color, start: selectionOffsets.start, end: selectionOffsets.end},
    ]);
    setHighlights(next);
  };

  // Remove highlight inside selection
  const removeHighlightInSelection = () => {
    if (!selectionOffsets) return;
    const cleaned = subtractRange(highlights, selectionOffsets);
    setHighlights(cleaned);
  };

  // Unwrap all .highlight and .selection-indicator spans
  const unwrapAll = (root: HTMLElement) => {
    const unwrap = (el: Element) => {
      const parent = el.parentNode!;
      while (el.firstChild) parent.insertBefore(el.firstChild, el);
      parent.removeChild(el);
    };
    root
      .querySelectorAll("span.highlight, span.selection-indicator")
      .forEach((el) => unwrap(el));
  };

  // Render spans for highlights (and selection indicator)
  const renderDecorations = React.useCallback(() => {
    if (!containerRef.current) return;
    const root = containerRef.current;

    // Start from pristine structure: remove previous highlight/selection wrappers
    unwrapAll(root);

    // Apply highlight spans
    if (highlights.length > 0) {
      const textNodes = getTextNodes();
      if (textNodes.length === 0) return;

      let idx = 0;
      const hs = [...highlights].sort((x, y) => x.start - y.start);
      for (const h of hs) {
        // advance to first node intersecting h
        while (idx < textNodes.length && textNodes[idx].end <= h.start) idx++;
        let pos = h.start;

        while (idx < textNodes.length && textNodes[idx].start < h.end) {
          const {node, start, end} = textNodes[idx];
          const nodeText = node.nodeValue || "";
          const localStart = Math.max(0, pos - start);
          const localEnd = Math.min(end, h.end) - start;
          if (localStart < localEnd) {
            // split node into [before][target][after]
            const before = nodeText.slice(0, localStart);
            const target = nodeText.slice(localStart, localEnd);
            const after = nodeText.slice(localEnd);

            const frag = document.createDocumentFragment();
            if (before) frag.appendChild(document.createTextNode(before));

            const span = document.createElement("span");
            span.className = "highlight";
            span.setAttribute("data-highlight-id", h.id);
            span.setAttribute("data-highlight-color", h.color);
            span.style.backgroundColor = h.color;
            span.textContent = target;
            frag.appendChild(span);

            if (after) frag.appendChild(document.createTextNode(after));

            node.replaceWith(frag);

            // update node index map since we replaced the node
            // rebuild text node list quickly by restarting (cheap enough for UI)
            // (keeps code simple & correct)
            idx = 0;
            break; // restart outer loop scanning highlights
          } else {
            idx++;
          }
        }
      }
    }

    // Draw selection indicator (outline) so user sees what will be affected
    if (selectionOffsets) {
      const textNodes = getTextNodes();
      if (textNodes.length === 0) return;
      let s = selectionOffsets.start;
      let e = selectionOffsets.end;

      let i = 0;
      while (i < textNodes.length && textNodes[i].end <= s) i++;

      let pos = s;
      while (i < textNodes.length && textNodes[i].start < e) {
        const {node, start, end} = textNodes[i];
        const nodeText = node.nodeValue || "";
        const localStart = Math.max(0, pos - start);
        const localEnd = Math.min(end, e) - start;
        if (localStart < localEnd) {
          const before = nodeText.slice(0, localStart);
          const target = nodeText.slice(localStart, localEnd);
          const after = nodeText.slice(localEnd);

          const frag = document.createDocumentFragment();
          if (before) frag.appendChild(document.createTextNode(before));

          const span = document.createElement("span");
          span.className = "selection-indicator";
          span.textContent = target;
          frag.appendChild(span);

          if (after) frag.appendChild(document.createTextNode(after));

          node.replaceWith(frag);
          // rebuild mapping and continue
          i = 0;
          // move the absolute cursor forward
          pos += target.length;
        } else {
          i++;
        }
      }
    }
  }, [highlights, selectionOffsets, getTextNodes]);

  // Repaint highlights/selection when data changes
  React.useEffect(() => {
    renderDecorations();
  }, [renderDecorations]);

  // mouse events: track selection offsets
  const onMouseUp = React.useCallback(
    () => captureSelection(),
    [captureSelection]
  );
  const onKeyUp = React.useCallback(
    () => captureSelection(),
    [captureSelection]
  );

  return (
    <div className="relative h-full">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .highlight {
              padding: 0 0px;
              border-radius: 2px;
            }
            .selection-indicator {
              outline: 2px solid rgba(59,130,246,.9);
              outline-offset: 1px;
              border-radius: 2px;
            }
            .editor-js-view {
              -webkit-user-select: text; -moz-user-select: text; user-select: text;
            }
          `,
        }}
      />
      {/* Controls */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <HighlightColorPicker
          selectedHighlightColor={selectedHighlightColor}
          setSelectedHighlightColor={setSelectedHighlightColor}
          onApplyColor={(c) => applyHighlight(c)}
          onRemove={() => removeHighlightInSelection()}
        />
      </div>

      {/* Content container */}
      <div
        ref={containerRef}
        className="h-fit overflow-scroll w-full max-h-[300px] text-primary bg-muted/20 blurBack p-4 rounded-b-md editor-js-view flex flex-col gap-4 pb-10"
        onMouseUp={onMouseUp}
        onKeyUp={onKeyUp}
        tabIndex={0}
      />
    </div>
  );
};

export default EditorJsRender;

// --- HighlightColorPicker.tsx ---
const HighlightColorPicker = ({
  selectedHighlightColor,
  setSelectedHighlightColor,
  onApplyColor,
  onRemove,
}: {
  selectedHighlightColor: string;
  setSelectedHighlightColor: (color: string) => void;
  onApplyColor: (color: string) => void;
  onRemove: () => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const colors = [
    "#ffeb3b",
    "#ff9800",
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#00bcd4",
    "#4caf50",
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Highlighter className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-3">
          {/* Colors */}
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setSelectedHighlightColor(color);
                  onApplyColor(color);
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

          {/* Remove option */}
          <button
            onClick={() => {
              onRemove();
              setOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 text-sm border rounded-md py-2 hover:bg-muted transition"
          >
            <Eraser className="h-4 w-4" />
            Remove highlight
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
