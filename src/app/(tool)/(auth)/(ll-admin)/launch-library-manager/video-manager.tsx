"use client";

import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {collection, doc, getDocs, setDoc} from "firebase/firestore";
import {db} from "@/config/firebase";
import type {LaunchLibraryFilterField} from "@/src/app/(marketing)/launch-library/data/types";
import {HARD_CODED_FILTER_OPTION_COUNTS, localData, VideoData} from "./data";
import Link from "next/link";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area";
import {Icons} from "@/components/icons";

const LAUNCH_LIBRARY_DISMISSED_LOCAL_KEY =
  "launch-library-dismissed-local-videos";

type SyncStatus = "synced" | "missing" | "unsynced";
type DownloadState = "idle" | "downloading" | "success" | "error";

type BatchSyncState =
  | {status: "idle"; total: 0; completed: 0; failed: 0}
  | {status: "syncing"; total: number; completed: number; failed: number}
  | {status: "success"; total: number; completed: number; failed: number}
  | {status: "error"; total: number; completed: number; failed: number};

type Filters = {
  query: string;
  cohort: string;
  score: string;
  industry: string;
  sector: string;
  creativeFormat: string;
  tone: string;
  production: string;
  hook: string;
};

const DEFAULT_FILTERS: Filters = {
  query: "",
  cohort: "all",
  score: "all",
  industry: "all",
  sector: "all",
  creativeFormat: "all",
  tone: "all",
  production: "all",
  hook: "all",
};

const arrayFields: Array<keyof VideoData> = [
  "industry",
  "sector",
  "creativeFormat",
  "tone",
  "production",
  "hook",
];

function titleCase(value: string) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function parseDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function matchesArrayFilter(values: string[], filter: string) {
  return filter === "all" ? true : values.includes(filter);
}

function buildSearchBlob(item: VideoData) {
  return [
    item.name,
    item.cohort,
    ...(item.industry ?? []),
    ...(item.sector ?? []),
    ...(item.creativeFormat ?? []),
    ...(item.tone ?? []),
    ...(item.production ?? []),
    ...(item.hook ?? []),
    item.commentary,
    item.description,
    item.authorUsername,
    item.createdAt,
    item.postId,
    item.postUrl,
    item.website,
    item.ycUrl,
    item.thumbnail,
    item.videoUrl,
    item.logo,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function videoMatchesFilters(video: VideoData, filters: Filters) {
  const query = filters.query.trim().toLowerCase();

  const matchesQuery = query ? buildSearchBlob(video).includes(query) : true;
  const matchesScore =
    filters.score === "all" ? true : String(video.score) === filters.score;

  return (
    matchesQuery &&
    (filters.cohort === "all" || video.cohort === filters.cohort) &&
    matchesScore &&
    matchesArrayFilter(video.industry ?? [], filters.industry) &&
    matchesArrayFilter(video.sector ?? [], filters.sector) &&
    matchesArrayFilter(video.creativeFormat ?? [], filters.creativeFormat) &&
    matchesArrayFilter(video.tone ?? [], filters.tone) &&
    matchesArrayFilter(video.production ?? [], filters.production) &&
    matchesArrayFilter(video.hook ?? [], filters.hook)
  );
}

function getHardcodedOptions(field: LaunchLibraryFilterField) {
  return Object.keys(HARD_CODED_FILTER_OPTION_COUNTS[field] ?? {}).sort(
    (a, b) => a.localeCompare(b),
  );
}

function getFilterCounts(
  videos: VideoData[],
): Record<LaunchLibraryFilterField, Record<string, number>> {
  const fields: LaunchLibraryFilterField[] = [
    "cohort",
    "industry",
    "sector",
    "creativeFormat",
    "tone",
    "production",
    "hook",
    "score",
  ];

  const result = {} as Record<LaunchLibraryFilterField, Record<string, number>>;

  for (const field of fields) {
    result[field] = {};

    for (const video of videos) {
      const value = video[field];

      if (value == null) continue;

      if (Array.isArray(value)) {
        for (const v of value) {
          const key = String(v);
          result[field][key] = (result[field][key] ?? 0) + 1;
        }
      } else {
        const key = String(value);
        result[field][key] = (result[field][key] ?? 0) + 1;
      }
    }

    result[field] = Object.fromEntries(
      Object.entries(result[field]).sort((a, b) => b[1] - a[1]),
    );
  }

  return result;
}

function combineLocalAndFirebaseVideos(
  localVideos: VideoData[],
  firebaseVideosById: Record<string, VideoData>,
) {
  const result: VideoData[] = [];

  const firebaseIds = new Set(Object.keys(firebaseVideosById));

  for (const video of Object.values(firebaseVideosById)) {
    result.push(video);
  }

  for (const localVideo of localVideos) {
    if (!firebaseIds.has(localVideo.postId)) {
      result.push(localVideo);
    }
  }

  return result;
}

function isLocalOnlyVideo(
  video: VideoData,
  firebaseVideosById: Record<string, VideoData>,
) {
  return !firebaseVideosById[video.postId];
}

function isFirebaseVideo(
  video: VideoData,
  firebaseVideosById: Record<string, VideoData>,
) {
  return !!firebaseVideosById[video.postId];
}

function hasCommentary(video: VideoData) {
  return !!video.commentary && video.commentary.trim() !== "";
}

function getActiveFilterEntries(filters: Filters) {
  return Object.entries(filters).filter(
    ([key, value]) => key !== "query" && value !== "all" && value !== "",
  );
}

function getVideoSyncStatus(
  video: VideoData,
  firebaseVideosById: Record<string, VideoData>,
): SyncStatus {
  const firebaseVideo = firebaseVideosById[video.postId];

  if (!firebaseVideo) return "missing";
  if (JSON.stringify(firebaseVideo) === JSON.stringify(video)) return "synced";
  return "unsynced";
}

async function loadLaunchLibraryFromFirebase() {
  const snapshot = await getDocs(collection(db, "launch-library"));
  const byId: Record<string, VideoData> = {};

  snapshot.forEach((docSnap) => {
    const data = docSnap.data() as VideoData;
    byId[data.postId] = data;
  });

  return byId;
}

async function saveVideoToFirebase(video: VideoData) {
  await setDoc(doc(db, "launch-library", video.postId), video, {merge: true});
}

async function saveAllVideosToFirebase(videos: VideoData[]) {
  await Promise.all(
    videos.map((video) =>
      setDoc(doc(db, "launch-library", video.postId), video, {merge: true}),
    ),
  );
}

function TagList({items}: {items: string[]}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-200"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default function Page() {
  const [videos, setVideos] = useState<VideoData[]>(localData);
  const [firebaseVideosById, setFirebaseVideosById] = useState<
    Record<string, VideoData>
  >({});
  const [libraryLoadingState, setLibraryLoadingState] = useState<
    "loading" | "ready" | "error"
  >("loading");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(
    localData[0]?.postId ?? null,
  );
  const [syncState, setSyncState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [downloadState, setDownloadState] = useState<DownloadState>("idle");
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const [manualUploadState, setManualUploadState] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [manualUploadError, setManualUploadError] = useState<string | null>(
    null,
  );
  const [logoUploadState, setLogoUploadState] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);
  const [draftVideo, setDraftVideo] = useState<VideoData | null>(null);
  const [dismissedLocalVideoIds, setDismissedLocalVideoIds] = useState<
    string[]
  >(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(
        LAUNCH_LIBRARY_DISMISSED_LOCAL_KEY,
      );
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((id): id is string => typeof id === "string");
    } catch (error) {
      console.error(error);
      return [];
    }
  });
  const [filtersPopoverOpen, setFiltersPopoverOpen] = useState(false);
  const [batchSyncState, setBatchSyncState] = useState<BatchSyncState>({
    status: "idle",
    total: 0,
    completed: 0,
    failed: 0,
  });
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function hydrateFromFirebase() {
      try {
        setLibraryLoadingState("loading");
        const firebaseById = await loadLaunchLibraryFromFirebase();
        if (!isMounted) return;

        setFirebaseVideosById(firebaseById);
        setVideos(combineLocalAndFirebaseVideos(localData, firebaseById));
        setLibraryLoadingState("ready");
      } catch (error) {
        console.error(error);
        if (!isMounted) return;
        setVideos(localData);
        setLibraryLoadingState("error");
      }
    }

    hydrateFromFirebase();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        LAUNCH_LIBRARY_DISMISSED_LOCAL_KEY,
        JSON.stringify(dismissedLocalVideoIds),
      );
    } catch (error) {
      console.error(error);
    }
  }, [dismissedLocalVideoIds]);

  const selectedVideo = useMemo(
    () => videos.find((video) => video.postId === selectedId) ?? null,
    [videos, selectedId],
  );

  const selectedVideoSyncStatus = useMemo<SyncStatus>(() => {
    if (!selectedVideo) return "missing";

    const firebaseVideo = firebaseVideosById[selectedVideo.postId];

    if (!firebaseVideo) return "missing";

    const compareTarget =
      draftVideo && draftVideo.postId === selectedVideo.postId
        ? draftVideo
        : selectedVideo;

    if (JSON.stringify(firebaseVideo) === JSON.stringify(compareTarget)) {
      return "synced";
    }

    return "unsynced";
  }, [selectedVideo, draftVideo, firebaseVideosById]);

  useEffect(() => {
    setDownloadState("idle");
    setDownloadError(null);
    setManualUploadState("idle");
    setManualUploadError(null);
    setLogoUploadState("idle");
    setLogoUploadError(null);
    setDraftVideo(null);
  }, [selectedId]);

  const editOptions = useMemo(
    () => ({
      cohort: getHardcodedOptions("cohort"),
      industry: getHardcodedOptions("industry"),
      sector: getHardcodedOptions("sector"),
      creativeFormat: getHardcodedOptions("creativeFormat"),
      tone: getHardcodedOptions("tone"),
      production: getHardcodedOptions("production"),
      hook: getHardcodedOptions("hook"),
      score: getHardcodedOptions("score"),
    }),
    [],
  );

  const filterOptions = editOptions;

  function getDisplaySyncStatus(video: VideoData): SyncStatus {
    if (
      draftVideo &&
      video.postId === selectedId &&
      draftVideo.postId === video.postId
    ) {
      return getVideoSyncStatus(draftVideo, firebaseVideosById);
    }

    return getVideoSyncStatus(video, firebaseVideosById);
  }

  const filteredVideos = useMemo(() => {
    return videos
      .filter((item) => {
        const isDismissedLocal =
          isLocalOnlyVideo(item, firebaseVideosById) &&
          dismissedLocalVideoIds.includes(item.postId);

        if (isDismissedLocal) return false;

        return videoMatchesFilters(item, filters);
      })
      .sort((a, b) => {
        const aIsLocalOnly = isLocalOnlyVideo(a, firebaseVideosById);
        const bIsLocalOnly = isLocalOnlyVideo(b, firebaseVideosById);

        if (aIsLocalOnly !== bIsLocalOnly) {
          return aIsLocalOnly ? -1 : 1;
        }

        const aIsMissingVideo = !a.videoUrl;
        const bIsMissingVideo = !b.videoUrl;

        if (aIsMissingVideo !== bIsMissingVideo) {
          return aIsMissingVideo ? -1 : 1;
        }

        const aHasNoCommentary = !hasCommentary(a);
        const bHasNoCommentary = !hasCommentary(b);

        if (aHasNoCommentary !== bHasNoCommentary) {
          return aHasNoCommentary ? -1 : 1;
        }

        const aIsMissingThumbnail = !a.thumbnail;
        const bIsMissingThumbnail = !b.thumbnail;

        if (aIsMissingThumbnail !== bIsMissingThumbnail) {
          return aIsMissingThumbnail ? -1 : 1;
        }

        const aSyncStatus = getDisplaySyncStatus(a);
        const bSyncStatus = getDisplaySyncStatus(b);

        const aIsUnsynced = aSyncStatus !== "synced";
        const bIsUnsynced = bSyncStatus !== "synced";

        if (aIsUnsynced !== bIsUnsynced) {
          return aIsUnsynced ? -1 : 1;
        }

        return 0;
      });
  }, [
    filters,
    videos,
    firebaseVideosById,
    selectedId,
    draftVideo,
    dismissedLocalVideoIds,
  ]);

  function dismissLocalVideo(postId: string) {
    setDismissedLocalVideoIds((current) =>
      current.includes(postId) ? current : [...current, postId],
    );

    if (selectedId === postId) {
      setSelectedId(null);
      setDraftVideo(null);
    }
  }

  const unsyncedVideos = useMemo(() => {
    return videos.filter((video) => {
      const status = getVideoSyncStatus(video, firebaseVideosById);
      return status === "missing" || status === "unsynced";
    });
  }, [videos, firebaseVideosById]);

  const missingVideoCount = useMemo(() => {
    return videos.filter((v) => !v.videoUrl).length;
  }, [videos]);

  const missingCommentaryCount = useMemo(() => {
    return videos.filter((v) => !hasCommentary(v)).length;
  }, [videos]);

  const missingThumbnailCount = useMemo(() => {
    return videos.filter((v) => !v.thumbnail).length;
  }, [videos]);

  useEffect(() => {
    if (!selectedId && filteredVideos.length) {
      setSelectedId(filteredVideos[0].postId);
      return;
    }

    if (
      selectedId &&
      !filteredVideos.some((video) => video.postId === selectedId)
    ) {
      setSelectedId(filteredVideos[0]?.postId ?? null);
    }
  }, [filteredVideos, selectedId]);

  function patchSelectedVideo(patch: Partial<VideoData>) {
    if (!selectedVideo) return;

    setVideos((current) =>
      current.map((video) =>
        video.postId === selectedVideo.postId ? {...video, ...patch} : video,
      ),
    );
  }

  const handleEditPanelSave = useCallback(async (nextVideo: VideoData) => {
    setSyncState("saving");
    try {
      await saveVideoToFirebase(nextVideo);

      setVideos((current) =>
        current.map((video) =>
          video.postId === nextVideo.postId ? nextVideo : video,
        ),
      );

      setFirebaseVideosById((current) => ({
        ...current,
        [nextVideo.postId]: nextVideo,
      }));

      setSyncState("saved");
    } catch (error) {
      console.error(error);
      setSyncState("error");
    }
  }, []);

  async function saveNow() {
    try {
      setSyncState("saving");
      await saveAllVideosToFirebase(videos);
      setFirebaseVideosById(
        Object.fromEntries(videos.map((video) => [video.postId, video])),
      );
      setSyncState("saved");
    } catch (error) {
      console.error(error);
      setSyncState("error");
    }
  }

  async function syncAllUnsyncedVideos() {
    if (!unsyncedVideos.length) {
      setBatchSyncState({
        status: "success",
        total: 0,
        completed: 0,
        failed: 0,
      });
      return;
    }

    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

    setBatchSyncState({
      status: "syncing",
      total: unsyncedVideos.length,
      completed: 0,
      failed: 0,
    });

    try {
      let completed = 0;
      let failed = 0;
      const nextFirebaseVideosById = {...firebaseVideosById};

      for (const video of unsyncedVideos) {
        try {
          await saveVideoToFirebase(video);
          nextFirebaseVideosById[video.postId] = video;
          completed += 1;
        } catch (error) {
          console.error(`Failed syncing video ${video.postId}`, error);
          failed += 1;
        }

        setBatchSyncState({
          status: "syncing",
          total: unsyncedVideos.length,
          completed,
          failed,
        });
      }

      setFirebaseVideosById(nextFirebaseVideosById);

      setBatchSyncState({
        status: failed > 0 ? "error" : "success",
        total: unsyncedVideos.length,
        completed,
        failed,
      });
    } catch (error) {
      console.error(error);
      setBatchSyncState((current) => ({
        ...current,
        status: "error",
      }));
    }
  }

  async function downloadSelectedVideo() {
    if (!selectedVideo?.postUrl) {
      setDownloadState("error");
      setDownloadError("Add a Post URL first.");
      return;
    }

    try {
      setDownloadState("downloading");
      setDownloadError(null);

      const response = await fetch("/api/download-twitter-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: selectedVideo.postId,
          postUrl: selectedVideo.postUrl,
          name: selectedVideo.name,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Failed to download video.");
      }

      const nextVideo: VideoData = {
        ...selectedVideo,
        videoUrl: result.videoUrl ?? selectedVideo.videoUrl,
      };

      setVideos((current) =>
        current.map((video) =>
          video.postId === selectedVideo.postId ? nextVideo : video,
        ),
      );
      if (isFirebaseVideo(selectedVideo, firebaseVideosById)) {
        setFirebaseVideosById((current) => ({
          ...current,
          [selectedVideo.postId]: nextVideo,
        }));
      }
      setDownloadState("success");
    } catch (error) {
      console.error(error);
      setDownloadState("error");
      setDownloadError(
        error instanceof Error ? error.message : "Failed to download video.",
      );
    }
  }

  async function handleManualVideoUpload(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (!file || !selectedVideo) return;

    try {
      setManualUploadState("uploading");
      setManualUploadError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("postId", selectedVideo.postId);
      formData.append("name", selectedVideo.name);

      const response = await fetch("/api/upload-launch-video", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Failed to upload video.");
      }

      const nextVideo: VideoData = {
        ...selectedVideo,
        videoUrl: result.videoUrl ?? selectedVideo.videoUrl,
      };

      setVideos((current) =>
        current.map((video) =>
          video.postId === selectedVideo.postId ? nextVideo : video,
        ),
      );

      if (isFirebaseVideo(selectedVideo, firebaseVideosById)) {
        setFirebaseVideosById((current) => ({
          ...current,
          [selectedVideo.postId]: nextVideo,
        }));
      }

      setManualUploadState("success");

      e.target.value = "";
    } catch (error) {
      console.error(error);
      setManualUploadState("error");
      setManualUploadError(
        error instanceof Error ? error.message : "Failed to upload video.",
      );
      e.target.value = "";
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !selectedVideo) return;

    try {
      setLogoUploadState("uploading");
      setLogoUploadError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("postId", selectedVideo.postId);
      formData.append("name", selectedVideo.name);

      const response = await fetch("/api/upload-launch-logo", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Failed to upload logo.");
      }

      const nextVideo: VideoData = {
        ...selectedVideo,
        logo: result.logoUrl ?? selectedVideo.logo ?? null,
      };

      setVideos((current) =>
        current.map((video) =>
          video.postId === selectedVideo.postId ? nextVideo : video,
        ),
      );

      if (isFirebaseVideo(selectedVideo, firebaseVideosById)) {
        setFirebaseVideosById((current) => ({
          ...current,
          [selectedVideo.postId]: nextVideo,
        }));
        try {
          await saveVideoToFirebase(nextVideo);
        } catch (persistError) {
          console.error(persistError);
        }
      }

      setLogoUploadState("success");
      e.target.value = "";
    } catch (error) {
      console.error(error);
      setLogoUploadState("error");
      setLogoUploadError(
        error instanceof Error ? error.message : "Failed to upload logo.",
      );
      e.target.value = "";
    }
  }

  function setThumbnailFromCurrentFrame() {
    const video = videoRef.current;
    if (!video || !selectedVideo) return;

    const maxWidth = 480;
    const aspectRatio = (video.videoWidth || 1280) / (video.videoHeight || 720);

    const width = Math.min(video.videoWidth || 1280, maxWidth);
    const height = Math.round(width / aspectRatio);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
    patchSelectedVideo({thumbnail: dataUrl});
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(videos, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "video-data.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportSavedFirebaseFilterCounts() {
    const savedVideos = Object.values(firebaseVideosById);
    const counts = getFilterCounts(savedVideos);

    const formatted = `export const HARD_CODED_FILTER_OPTION_COUNTS: Record<
  LaunchLibraryFilterField,
  Record<string, number>
> = ${JSON.stringify(counts, null, 2)};`;

    const blob = new Blob([formatted], {
      type: "text/typescript;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hard-coded-filter-option-counts.ts";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function deleteSelected() {
    if (!selectedVideo) return;

    setVideos((current) =>
      current.filter((video) => video.postId !== selectedVideo.postId),
    );
    setSelectedId(null);
  }

  const activeFilterEntries = getActiveFilterEntries(filters);

  const getFaviconUrl = (url: string) => {
    try {
      // clean the url add https if it is not there
      const cleanedUrl = url.startsWith("http") ? url : `https://${url}`;

      const domain = new URL(cleanedUrl).hostname;
      return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
    } catch {
      return "invalid";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-[1700px]">
        {/* <div className="mb-6 flex flex-col gap-4 border border-zinc-800 bg-zinc-950 p-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">
              Video data manager
            </div>
            <h1 className="mt-2 text-3xl font-semibold">
              YC launch video library
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-zinc-400">
              Search every field, edit metadata, push changes to Firebase when
              ready, set thumbnails from video frames, and download videos from
              X posts.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span
                className={classNames(
                  "rounded-full border px-2.5 py-1",
                  libraryLoadingState === "loading" &&
                    "border-amber-500/40 bg-amber-500/10 text-amber-300",
                  libraryLoadingState === "ready" &&
                    "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
                  libraryLoadingState === "error" &&
                    "border-red-500/40 bg-red-500/10 text-red-300",
                )}
              >
                {libraryLoadingState === "loading"
                  ? "Loading Firebase library"
                  : libraryLoadingState === "ready"
                    ? "Firebase library ready"
                    : "Using local data only"}
              </span>
              <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-zinc-300">
                Local source: ./data
              </span>
              <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-zinc-300">
                {unsyncedVideos.length} unsynced
              </span>

              <span className="rounded-full border border-red-500/40 bg-red-500/10 px-2.5 py-1 text-red-300">
                {missingVideoCount} missing video
              </span>

              <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-amber-300">
                {missingThumbnailCount} missing thumbnail
              </span>
            </div>
          </div>

          <div className="flex w-full max-w-md flex-col gap-3">
            <button
              onClick={syncAllUnsyncedVideos}
              disabled={
                batchSyncState.status === "syncing" || !unsyncedVideos.length
              }
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {batchSyncState.status === "syncing"
                ? `Syncing ${batchSyncState.completed} / ${batchSyncState.total}`
                : "Sync all"}
            </button>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Batch sync status</span>
                <span>
                  {batchSyncState.status === "idle" && "Idle"}
                  {batchSyncState.status === "syncing" &&
                    `${batchSyncState.completed} / ${batchSyncState.total}`}
                  {batchSyncState.status === "success" &&
                    `Done ${batchSyncState.completed} / ${batchSyncState.total}`}
                  {batchSyncState.status === "error" &&
                    `Completed ${batchSyncState.completed} / ${batchSyncState.total} · Failed ${batchSyncState.failed}`}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-zinc-900">
                <div
                  className={classNames(
                    "h-full rounded-full transition-all",
                    batchSyncState.status === "error" && "bg-red-400",
                    batchSyncState.status !== "error" && "bg-white",
                  )}
                  style={{
                    width:
                      batchSyncState.total > 0
                        ? `${(batchSyncState.completed / batchSyncState.total) * 100}%`
                        : "0%",
                  }}
                />
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span
                  className={classNames(
                    "rounded-full border px-2.5 py-1",
                    batchSyncState.status === "idle" &&
                      "border-zinc-700 bg-zinc-900 text-zinc-300",
                    batchSyncState.status === "syncing" &&
                      "border-amber-500/40 bg-amber-500/10 text-amber-300",
                    batchSyncState.status === "success" &&
                      "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
                    batchSyncState.status === "error" &&
                      "border-red-500/40 bg-red-500/10 text-red-300",
                  )}
                >
                  {batchSyncState.status === "idle"
                    ? "Ready"
                    : batchSyncState.status === "syncing"
                      ? "Batch syncing"
                      : batchSyncState.status === "success"
                        ? "Batch sync complete"
                        : "Batch sync finished with errors"}
                </span>
              </div>
            </div>
          </div>
        </div> */}

        <div className="py-2">
          <div
            id="workspace"
            className="sticky top-2 px-2 grid h-[calc(100vh-16px)] grid-cols-1 gap-6 lg:grid-cols-3"
          >
            <div
              id="videos-display"
              className="flex h-full min-h-0 flex-col rounded-3xl border border-zinc-800 bg-zinc-950/60"
            >
              <div className="absolute bottom-0 h-10 w-full z-20 pointer-events-none bg-gradient-to-t from-black to-transparent" />

              <div className="flex min-h-0 flex-1 flex-col">
                <div className="relative flex h-[150px] shrink-0 flex-col gap-2 rounded-3xl border-zinc-800 bg-black p-4">
                  <div className="flex flex-wrap items-center  gap-2 text-xs">
                    {/* <div className="text-sm font-medium text-white px-4  flex items-center justify-between">
                      {filteredVideos.length} total videos
                    </div> */}
                    <button className="rounded-xl border flex items-center justify-center gap-2 border-zinc-700 px-4 py-2 text-sm font-medium  transition bg-white text-black disabled:cursor-not-allowed disabled:opacity-50">
                      <Icons.add className="w-4 h-4" />
                      New Video
                    </button>
                    <span className="rounded-full h-fit border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-zinc-300">
                      {videos.length} total videos
                    </span>
                    {/* {unsyncedVideos.length > 0 && ( */}
                    <span className="rounded-full border h-fit border-zinc-700 bg-zinc-900 px-2.5 py-1 text-zinc-300">
                      {unsyncedVideos.length} unsynced
                    </span>
                    {/* )} */}

                    {/* {missingVideoCount > 0 && ( */}
                    <span className="rounded-full border h-fit border-red-500/40 bg-red-500/10 px-2.5 py-1 text-red-300">
                      {missingVideoCount} missing video
                    </span>
                    {/* )} */}
                    {/* {missingCommentaryCount > 0 && ( */}
                    <span className="rounded-full border h-fit border-red-500/40 bg-red-500/10 px-2.5 py-1 text-red-300">
                      {missingCommentaryCount} missing commentary
                    </span>
                    {/* )} */}

                    {/* {missingThumbnailCount > 0 && ( */}
                    <span className="rounded-full border h-fit border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-amber-300">
                      {missingThumbnailCount} missing thumbnail
                    </span>
                    {/* )} */}
                  </div>
                  <div className="flex flex-col gap-3  ">
                    <div className="flex gap-3">
                      <input
                        value={filters.query}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            query: e.target.value,
                          }))
                        }
                        placeholder="Search by any field..."
                        className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm outline-none placeholder:text-zinc-500"
                      />

                      <button
                        type="button"
                        onClick={() => setFiltersPopoverOpen((prev) => !prev)}
                        className="rounded-xl border border-zinc-700 px-4 py-3 text-sm text-zinc-200 transition hover:bg-zinc-900"
                      >
                        Filters{" "}
                        {activeFilterEntries.length > 0 &&
                          `(${activeFilterEntries.length})`}
                      </button>
                    </div>
                  </div>

                  {activeFilterEntries.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {activeFilterEntries.map(([key, value]) => (
                        <span
                          key={key}
                          className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-200"
                        >
                          {titleCase(key)}: {value}
                        </span>
                      ))}
                    </div>
                  )}

                  {filtersPopoverOpen && (
                    <div className="absolute top-[calc(100%+12px)] right-4 z-50 w-full max-w-[720px] rounded-3xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-white">
                            Filters
                          </div>
                          <div className="text-xs text-zinc-500">
                            Narrow the displayed results
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setFiltersPopoverOpen(false)}
                          className="rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-300 transition hover:bg-zinc-900"
                        >
                          Close
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <FilterSelect
                          label="Cohort"
                          value={filters.cohort}
                          options={filterOptions.cohort}
                          onChange={(value) =>
                            setFilters((prev) => ({...prev, cohort: value}))
                          }
                        />

                        <FilterSelect
                          label="Score"
                          value={filters.score}
                          options={filterOptions.score}
                          onChange={(value) =>
                            setFilters((prev) => ({...prev, score: value}))
                          }
                        />

                        <FilterSelect
                          label="Industry"
                          value={filters.industry}
                          options={filterOptions.industry}
                          onChange={(value) =>
                            setFilters((prev) => ({...prev, industry: value}))
                          }
                        />

                        <FilterSelect
                          label="Sector"
                          value={filters.sector}
                          options={filterOptions.sector}
                          onChange={(value) =>
                            setFilters((prev) => ({...prev, sector: value}))
                          }
                        />

                        <FilterSelect
                          label="Creative Format"
                          value={filters.creativeFormat}
                          options={filterOptions.creativeFormat}
                          onChange={(value) =>
                            setFilters((prev) => ({
                              ...prev,
                              creativeFormat: value,
                            }))
                          }
                        />

                        <FilterSelect
                          label="Tone"
                          value={filters.tone}
                          options={filterOptions.tone}
                          onChange={(value) =>
                            setFilters((prev) => ({...prev, tone: value}))
                          }
                        />

                        <FilterSelect
                          label="Production"
                          value={filters.production}
                          options={filterOptions.production}
                          onChange={(value) =>
                            setFilters((prev) => ({...prev, production: value}))
                          }
                        />

                        <FilterSelect
                          label="Hook"
                          value={filters.hook}
                          options={filterOptions.hook}
                          onChange={(value) =>
                            setFilters((prev) => ({...prev, hook: value}))
                          }
                        />
                      </div>
                      {activeFilterEntries.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setFilters(DEFAULT_FILTERS);
                            setFiltersPopoverOpen(false);
                          }}
                          className="rounded-xl border border-zinc-700 px-4 py-3 mt-2 w-full text-sm text-zinc-200 transition hover:bg-zinc-900"
                        >
                          Clear Filters
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={exportSavedFirebaseFilterCounts}
                        disabled={libraryLoadingState !== "ready"}
                        className="rounded-xl border border-zinc-700 px-4 py-3 mt-2 w-full text-sm text-black bg-white transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Filter Export
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative min-h-0 flex-1 rounded-b-3xl border border-zinc-800 bg-black">
                  <ScrollArea className="h-full w-full ">
                    <div className="w-full min-w-0 px-4 pb-4 pt-3">
                      <div className="flex w-full min-w-0 flex-col gap-3">
                        {filteredVideos.map((video) => {
                          const isActive = video.postId === selectedId;
                          const isLocalOnly = isLocalOnlyVideo(
                            video,
                            firebaseVideosById,
                          );

                          return (
                            <button
                              id="select-video-button"
                              key={video.postId}
                              onClick={() => setSelectedId(video.postId)}
                              className={classNames(
                                "box-border grid-cols-[178px_1fr] gap-3 w-full grid min-w-0 max-w- rounded-2xl border p-3 text-left transition",
                                isActive
                                  ? "border-white bg-white/5"
                                  : "border-zinc-800 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900",
                              )}
                            >
                              <div className="h-20 w-32 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                                {video.thumbnail ? (
                                  <img
                                    src={video.thumbnail}
                                    alt={video.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center text-xs text-zinc-500">
                                    No thumbnail
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1 overflow-hidden">
                                <div className="flex min-w-0 items-start gap-2">
                                  <div className="flex min-w-0 flex-1 items-center gap-2">
                                    <img
                                      src={
                                        video.logo ||
                                        getFaviconUrl(video.website ?? "")
                                      }
                                      alt={video.name}
                                      className="h-4 w-4 shrink-0 rounded-full ring-white/20 ring-[1px] ring-offset-[2px] ring-offset-black"
                                    />
                                    <div className="truncate text-sm font-semibold text-white">
                                      {video.name || video.postId}
                                    </div>
                                  </div>

                                  <div className="shrink-0 rounded-full border border-zinc-700 px-2 py-0.5 text-xs text-zinc-300">
                                    {video.score != null
                                      ? `${video.score}/5`
                                      : "no score"}
                                  </div>
                                </div>

                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                                  <span
                                    className={classNames(
                                      "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                                      isLocalOnly
                                        ? "border-blue-500/40 bg-blue-500/10 text-blue-300"
                                        : "border-zinc-700 bg-zinc-900 text-zinc-300",
                                    )}
                                  >
                                    {isLocalOnly ? "Local" : "Firebase"}
                                  </span>

                                  <SyncBadge
                                    status={getDisplaySyncStatus(video)}
                                  />
                                  <HasVideoBadge hasVideo={!!video.videoUrl} />

                                  {!hasCommentary(video) ? (
                                    <span className="rounded-full border border-red-500/40 bg-red-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-red-300">
                                      No commentary
                                    </span>
                                  ) : null}
                                </div>

                                <div className="mt-2 line-clamp-2 text-xs text-zinc-400">
                                  {video.commentary ?? "No commentary yet."}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                </div>
              </div>
            </div>
            <ScrollArea
              id="video-area"
              className={classNames(
                " h-[calc(100vh-16px)] min-h-0 w-full pb-6 rounded-3xl  border bg-zinc-950/60  transition-colors",

                selectedVideoSyncStatus === "missing" && "border-red-500/60",

                selectedVideoSyncStatus === "unsynced" && "border-amber-500/60",

                selectedVideoSyncStatus === "synced" && "border-emerald-500/60",

                !selectedVideo && "border-zinc-800",
              )}
            >
              <div className="absolute bottom-0 h-10 w-full z-20 pointer-events-none bg-gradient-to-t from-black to-transparent" />
              <ScrollBar orientation="vertical" />

              <div id="edit-panel" className={classNames("p-5")}>
                {selectedVideo && (
                  <div
                    className={classNames(
                      "mb-4 rounded-xl px-3 py-2 text-xs font-medium",
                      selectedVideoSyncStatus === "missing" &&
                        "bg-red-500/10 text-red-300",
                      selectedVideoSyncStatus === "unsynced" &&
                        "bg-amber-500/10 text-amber-300",
                      selectedVideoSyncStatus === "synced" &&
                        "bg-emerald-500/10 text-emerald-300",
                    )}
                  >
                    {selectedVideoSyncStatus === "missing" && "Not in Database"}
                    {selectedVideoSyncStatus === "unsynced" &&
                      "Out of sync with Database"}
                    {selectedVideoSyncStatus === "synced" &&
                      "Synced with Database"}
                  </div>
                )}
                {!selectedVideo ? (
                  <div className="flex h-full min-h-[500px] items-center justify-center text-zinc-500">
                    Choose a record to edit
                  </div>
                ) : (
                  <>
                    <EditPanel
                      key={selectedVideo.postId}
                      selectedVideo={selectedVideo}
                      editOptions={editOptions}
                      onSave={handleEditPanelSave}
                      onChange={setDraftVideo}
                      showNotALaunch={isLocalOnlyVideo(
                        selectedVideo,
                        firebaseVideosById,
                      )}
                      onNotALaunch={() =>
                        dismissLocalVideo(selectedVideo.postId)
                      }
                    />

                    {(selectedVideoSyncStatus === "missing" ||
                      selectedVideoSyncStatus === "unsynced") && (
                      <div className="pointer-events-none absolute bottom-0 left-0 z-50 flex h-20 w-full items-center justify-center bg-gradient-to-t from-black to-transparent">
                        <button
                          type="button"
                          onClick={() => {
                            const nextVideo =
                              draftVideo &&
                              draftVideo.postId === selectedVideo.postId
                                ? draftVideo
                                : selectedVideo;
                            void handleEditPanelSave(nextVideo);
                          }}
                          className="pointer-events-auto w-[90%] rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
                        >
                          {syncState === "saving" ? (
                            <Icons.loader className="mx-auto h-[20px] w-[20px] animate-spin" />
                          ) : (
                            "Save changes"
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </ScrollArea>
            <div className="flex flex-col">
              <div className="flex items-end absolute top-0 right-0">
                {/*  */}
              </div>
              <ScrollArea
                id="video-area-right"
                className="h-[calc(100vh-16px)] min-h-0 w-full rounded-3xl border pb-6 border-zinc-800"
              >
                <ScrollBar orientation="vertical" />
                <div className="absolute bottom-0 h-10 w-full z-20 pointer-events-none bg-gradient-to-t from-black to-transparent" />

                <div id="video-display">
                  {!selectedVideo ? (
                    <div className="flex h-full min-h-[500px] items-center justify-center rounded-3xl border border-dashed border-zinc-800 text-zinc-500">
                      Select a video to view details
                    </div>
                  ) : (
                    <div className="space-y-5 p-5 ">
                      {selectedVideo &&
                        !videoMatchesFilters(selectedVideo, filters) && (
                          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
                            This row does not match the active filter. Adjust
                            filters or edit the saved record in the list source.
                          </div>
                        )}

                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-start gap-4">
                            <input
                              ref={logoInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => logoInputRef.current?.click()}
                              className="rounded-full transition hover:opacity-80"
                              title="Upload logo"
                            >
                              <img
                                src={
                                  selectedVideo.logo ||
                                  getFaviconUrl(selectedVideo.website ?? "")
                                }
                                alt={selectedVideo.name}
                                className="h-8 w-8 shrink-0 rounded-full ring-[2px] ring-white/20 ring-offset-[4px] ring-offset-black"
                              />
                            </button>
                            <h2 className="text-2xl font-semibold">
                              {selectedVideo.name}
                            </h2>
                          </div>
                          {(logoUploadState === "uploading" ||
                            logoUploadState === "success" ||
                            logoUploadState === "error") && (
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                              <span
                                className={classNames(
                                  "rounded-full border px-2.5 py-1",
                                  logoUploadState === "uploading" &&
                                    "border-amber-500/40 bg-amber-500/10 text-amber-300",
                                  logoUploadState === "success" &&
                                    "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
                                  logoUploadState === "error" &&
                                    "border-red-500/40 bg-red-500/10 text-red-300",
                                )}
                              >
                                {logoUploadState === "uploading"
                                  ? "Uploading logo..."
                                  : logoUploadState === "success"
                                    ? "Logo uploaded"
                                    : "Logo upload failed"}
                              </span>
                              {logoUploadError ? (
                                <span className="text-red-300">
                                  {logoUploadError}
                                </span>
                              ) : null}
                            </div>
                          )}

                          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
                            <span>@{selectedVideo.authorUsername}</span>
                            <span>•</span>
                            <span>{parseDate(selectedVideo.createdAt)}</span>
                            <span>•</span>
                            <span>{selectedVideo.cohort ?? "No cohort"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-5 ">
                        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-black">
                          {selectedVideo.videoUrl ? (
                            <video
                              ref={videoRef}
                              src={selectedVideo.videoUrl}
                              controls
                              crossOrigin="anonymous"
                              className="aspect-video w-full bg-black object-cover"
                            />
                          ) : selectedVideo.thumbnail ? (
                            <img
                              src={selectedVideo.thumbnail}
                              alt={selectedVideo.name}
                              className="aspect-video w-full object-cover"
                            />
                          ) : (
                            <div className="flex aspect-video items-center justify-center text-sm text-zinc-500">
                              Add a video URL or set a thumbnail
                            </div>
                          )}
                        </div>

                        <div className="rounded-3xl border border-zinc-800 bg-black p-4">
                          <div className=" space-y-3">
                            <TextField
                              label="Source Post URL"
                              value={selectedVideo.postUrl}
                              onChange={(value) =>
                                patchSelectedVideo({postUrl: value})
                              }
                            />

                            <button
                              onClick={downloadSelectedVideo}
                              disabled={
                                downloadState === "downloading" ||
                                !selectedVideo.postUrl
                              }
                              className="w-full rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {downloadState === "downloading"
                                ? "Downloading and uploading video..."
                                : selectedVideo.videoUrl
                                  ? "Re-download video"
                                  : "Download video"}
                            </button>

                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="video/*"
                              onChange={handleManualVideoUpload}
                              className="hidden"
                            />

                            <button
                              onClick={() => fileInputRef.current?.click()}
                              disabled={manualUploadState === "uploading"}
                              className="w-full rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {manualUploadState === "uploading"
                                ? "Uploading video..."
                                : selectedVideo.videoUrl
                                  ? "Replace with manual upload"
                                  : "Upload video from computer"}
                            </button>

                            {selectedVideo.videoUrl && (
                              <button
                                onClick={setThumbnailFromCurrentFrame}
                                className="w-full rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Set frame as thumbnail
                              </button>
                            )}

                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              {downloadState !== "idle" && (
                                <span
                                  className={classNames(
                                    "rounded-full border px-2.5 py-1",
                                    downloadState === "downloading" &&
                                      "border-amber-500/40 bg-amber-500/10 text-amber-300",
                                    downloadState === "success" &&
                                      "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
                                    downloadState === "error" &&
                                      "border-red-500/40 bg-red-500/10 text-red-300",
                                  )}
                                >
                                  {downloadState === "downloading"
                                    ? "Processing"
                                    : downloadState === "success"
                                      ? "Video stored"
                                      : "Failed"}
                                </span>
                              )}
                              {downloadError ? (
                                <span className="text-red-300">
                                  {downloadError}
                                </span>
                              ) : null}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              {manualUploadError ? (
                                <span className="text-red-300">
                                  {manualUploadError}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-5 ">
                        <SectionCard title="Tag fields">
                          <div className="space-y-4 grid grid-cols-2">
                            {arrayFields.map((field) => (
                              <div key={field}>
                                <div className="mb-2 text-sm font-medium text-zinc-200">
                                  {titleCase(String(field))}
                                </div>
                                <TagList
                                  items={selectedVideo[field] as string[]}
                                />
                              </div>
                            ))}
                          </div>
                        </SectionCard>
                      </div>

                      <button
                        onClick={deleteSelected}
                        className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-black p-4">
      <div className="mb-3 text-sm font-semibold text-white">{title}</div>
      {children}
    </section>
  );
}

function SingleValueSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const isEmpty = !value || value.trim() === "";

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-zinc-200">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={classNames(
          "w-full rounded-xl border px-3 py-2 text-sm text-white outline-none",
          isEmpty
            ? "border-red-500 bg-red-500/5"
            : "border-zinc-800 bg-zinc-950",
        )}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {isEmpty ? <div className="text-xs text-red-400">Required</div> : null}
    </label>
  );
}

function MultiValueSelect({
  label,
  values,
  options,
  onChange,
}: {
  label: string;
  values: string[];
  options: string[];
  onChange: (next: string[]) => void;
}) {
  const isEmpty = !values?.length;

  function toggleOption(option: string) {
    if (values.includes(option)) {
      onChange(values.filter((item) => item !== option));
      return;
    }

    onChange([...values, option]);
  }

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-zinc-200">{label}</span>

      <div
        className={classNames(
          "max-h-56 overflow-y-auto rounded-xl border p-3",
          isEmpty
            ? "border-red-500 bg-red-500/5"
            : "border-zinc-800 bg-zinc-950",
        )}
      >
        <div className="space-y-2">
          {options.map((option) => {
            const checked = values.includes(option);

            return (
              <label
                key={option}
                className="flex cursor-pointer items-center gap-2 text-sm text-zinc-200"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleOption(option)}
                  className="h-4 w-4 rounded border-zinc-700 bg-black"
                />
                <span>{option}</span>
              </label>
            );
          })}
        </div>
      </div>

      {values.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <span
              key={value}
              className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-200"
            >
              {value}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-zinc-800 bg-black px-3 py-2 text-sm text-white outline-none"
      >
        <option value="all">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  isEditable = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isEditable?: boolean;
}) {
  if (!isEditable) {
    return (
      <label className="block space-y-2">
        <span className="text-sm font-medium text-zinc-200">{label}</span>
        <div className="text-sm font-medium text-red-200">{value}</div>
      </label>
    );
  }

  const isEmpty = !value || value.trim() === "";

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-zinc-200">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={classNames(
          "w-full rounded-xl border px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500",
          isEmpty
            ? "border-red-500 bg-red-500/5"
            : "border-zinc-800 bg-zinc-950",
        )}
      />
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-zinc-200">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white outline-none"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const isEmpty = !value || value.trim() === "";

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-zinc-200">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className={classNames(
          "w-full rounded-xl border px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500",
          isEmpty
            ? "border-red-500 bg-red-500/5"
            : "border-zinc-800 bg-zinc-950",
        )}
      />
    </label>
  );
}

type EditPanelOptions = {
  cohort: string[];
  industry: string[];
  sector: string[];
  creativeFormat: string[];
  tone: string[];
  production: string[];
  hook: string[];
  score: string[];
};

const EditPanel = React.memo(function EditPanel({
  selectedVideo,
  editOptions,
  onSave,
  onChange,
  showNotALaunch,
  onNotALaunch,
}: {
  selectedVideo: VideoData;
  editOptions: EditPanelOptions;
  onSave: (video: VideoData) => void | Promise<void>;
  onChange?: (video: VideoData) => void;
  showNotALaunch?: boolean;
  onNotALaunch?: () => void;
}) {
  const [form, setForm] = useState<VideoData>(selectedVideo);

  useEffect(() => {
    setForm(selectedVideo);
  }, [selectedVideo]);

  useEffect(() => {
    onChange?.(form);
  }, [form, onChange]);

  function update(patch: Partial<VideoData>) {
    setForm((prev) => ({...prev, ...patch}));
  }

  return (
    <div className="space-y-4 pr-1 pb-4">
      <div>
        <div className="text-lg font-semibold">Edit video #{form.postId}</div>
        <div className="text-sm text-zinc-500">
          Edit locally, then use Save changes to write to the library and
          Firebase.
        </div>
      </div>

      <button
        type="button"
        onClick={() => window.open(form.postUrl, "_blank")}
        className="w-full rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        open post
      </button>

      {showNotALaunch ? (
        <button
          type="button"
          onClick={onNotALaunch}
          className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
        >
          Not a launch
        </button>
      ) : null}

      <TextField
        label="Company Name"
        value={form.name}
        onChange={(value) => update({name: value})}
      />

      <SingleValueSelect
        label="Cohort"
        value={form.cohort ?? ""}
        options={editOptions.cohort}
        onChange={(value) => update({cohort: value || null})}
      />

      <TextField
        label="Website"
        value={form.website ?? ""}
        onChange={(value) => update({website: value || null})}
      />
      <TextField
        label="YC URL"
        value={form.ycUrl ?? ""}
        onChange={(value) => update({ycUrl: value || null})}
      />
      {/* <TextField
        label="Video URL"
        value={form.videoUrl ?? ""}
        onChange={(value) => update({videoUrl: value || null})}
      />
      <TextField
        label="Thumbnail URL / Data URL"
        value={form.thumbnail ?? ""}
        onChange={(value) => update({thumbnail: value || null})}
      /> */}

      <label className="block space-y-2">
        <span className="text-sm font-medium text-zinc-200">Score</span>
        <select
          value={form.score ?? ""}
          onChange={(e) =>
            update({
              score: e.target.value
                ? (Number(e.target.value) as VideoData["score"])
                : null,
            })
          }
          className={classNames(
            "w-full rounded-xl border px-3 py-2 text-sm text-white outline-none",
            form.score == null
              ? "border-red-500 bg-red-500/5"
              : "border-zinc-800 bg-zinc-950",
          )}
        >
          <option value="">No score assigned</option>
          {[1, 2, 3, 4, 5].map((score) => (
            <option key={score} value={score}>
              {score}
            </option>
          ))}
        </select>
        {form.score == null ? (
          <div className="text-xs text-red-400">Required</div>
        ) : null}
      </label>

      <MultiValueSelect
        label="Industry"
        values={form.industry ?? []}
        options={editOptions.industry}
        onChange={(next) => update({industry: next})}
      />
      <MultiValueSelect
        label="Sector"
        values={form.sector ?? []}
        options={editOptions.sector}
        onChange={(next) => update({sector: next})}
      />
      <MultiValueSelect
        label="Creative Format"
        values={form.creativeFormat ?? []}
        options={editOptions.creativeFormat}
        onChange={(next) => update({creativeFormat: next})}
      />
      <MultiValueSelect
        label="Tone"
        values={form.tone ?? []}
        options={editOptions.tone}
        onChange={(next) => update({tone: next})}
      />
      <MultiValueSelect
        label="Production"
        values={form.production ?? []}
        options={editOptions.production}
        onChange={(next) => update({production: next})}
      />
      <MultiValueSelect
        label="Hook"
        values={form.hook ?? []}
        options={editOptions.hook}
        onChange={(next) => update({hook: next})}
      />

      <TextAreaField
        label="Commentary"
        value={form.commentary ?? ""}
        onChange={(value) => update({commentary: value || null})}
      />
    </div>
  );
});

function SyncBadge({status}: {status: SyncStatus}) {
  return (
    <span
      className={classNames(
        "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        status === "synced" &&
          "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
        status === "missing" && "border-zinc-600 bg-zinc-900 text-zinc-300",
        status === "unsynced" &&
          "border-amber-500/40 bg-amber-500/10 text-amber-300",
      )}
    >
      {status}
    </span>
  );
}

function HasVideoBadge({hasVideo}: {hasVideo: boolean}) {
  return (
    <span
      className={classNames(
        "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        hasVideo && "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
        !hasVideo && "border-red-500/40 bg-red-500/10 text-red-300",
      )}
    >
      {hasVideo ? "Video Downloaded" : "Missing Video"}
    </span>
  );
}

function LinkRow({label, value}: {label: string; value: string | null}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3">
      <div className="text-xs uppercase tracking-wide text-zinc-500">
        {label}
      </div>
      {value ? (
        <a
          href={value}
          target="_blank"
          rel="noreferrer"
          className="mt-1 block break-all text-sm text-zinc-200 underline decoration-zinc-700 underline-offset-4"
        >
          {value}
        </a>
      ) : (
        <div className="mt-1 text-sm text-zinc-500">Not set</div>
      )}
    </div>
  );
}
