export type TikTokPost = {
  id: string;
  text: string;
  textLanguage: string;
  createTime: number;
  createTimeISO: string;
  isAd: boolean;
  authorMeta: {
    id: string;
    name: string;
    profileUrl: string;
    nickName: string;
    verified: boolean;
    signature: string;
    bioLink: string | null;
    originalAvatarUrl: string;
    avatar: string;
    commerceUserInfo: {
      commerceUser: boolean;
    };
    privateAccount: boolean;
    region: string;
    roomId: string;
    ttSeller: boolean;
    following: number;
    friends: number;
    fans: number;
    heart: number;
    video: number;
    digg: number;
  };
  musicMeta: {
    musicName: string;
    musicAuthor: string;
    musicOriginal: boolean;
    playUrl: string;
    coverMediumUrl: string;
    originalCoverMediumUrl: string;
    musicId: string;
  };
  webVideoUrl: string;
  mediaUrls: string[];
  videoMeta: {
    height: number;
    width: number;
    duration: number;
    coverUrl: string;
    originalCoverUrl: string;
    definition: string;
    format: string;
    subtitleLinks: {
      language: string;
      downloadLink: string;
      tiktokLink: string;
      source: string;
      sourceUnabbreviated: string;
      version: string;
    }[];
  };
  diggCount: number;
  shareCount: number;
  playCount: number;
  collectCount: number;
  commentCount: number;
  mentions: any[]; // Adjust if known
  detailedMentions: any[]; // Adjust if known
  hashtags: {
    name: string;
  }[];
  effectStickers: any[]; // Adjust if known
  isSlideshow: boolean;
  isPinned: boolean;
  isSponsored: boolean;
  input: string;
  fromProfileSection: string;
};

export type FacebookPost = {
  facebookUrl: string;
  postId: string;
  pageName: string;
  url: string;
  time: string;
  timestamp: number;
  user: {
    id: string;
    name: string;
    profileUrl: string;
    profilePic: string;
  };
  text: string;
  textReferences: {
    url: string;
    mobileUrl: string;
    id: string;
  }[];
  likes: number;
  shares: number;
  viewsCount: number;
  topReactionsCount: number;
  isVideo: boolean;
  media: {
    thumbnail: string;
    __typename: string;
    thumbnailImage: {
      uri: string;
    };
    id: string;
    is_clipping_enabled: boolean;
    live_rewind_enabled: boolean;
    owner: {
      __typename: string;
      id: string;
      __isVideoOwner: string;
      has_professional_features_for_watch: boolean;
    };
    playable_duration_in_ms: number;
    is_huddle: boolean;
    url: string;
    width: number;
    height: number;
    videoId: string;
    publish_time: number;
    preferred_thumbnail: {
      image: {
        uri: string;
      };
      image_preview_payload: null;
      id: string;
    };
    image: {
      uri: string;
    };
    // The rest of the optional video-related metadata can be added here as needed
  }[];
  feedbackId: string;
  topLevelUrl: string;
  facebookId: string;
  pageAdLibrary: {
    is_business_page_active: boolean;
    id: string;
  };
  inputUrl: string;
};

export type InstagramPost = {
  inputUrl: string;
  id: string;
  type: "Video" | "Image" | string;
  shortCode: string;
  caption: string;
  hashtags: string[];
  mentions: string[];
  url: string;
  commentsCount: number;
  firstComment: string;
  latestComments: string[];
  dimensionsHeight: number;
  dimensionsWidth: number;
  displayUrl: string;
  images: string[]; // Placeholder – could be expanded if structure is known
  videoUrl: string;
  alt: string | null;
  likesCount: number;
  videoViewCount: number;
  videoPlayCount: number;
  timestamp: string;
  childPosts: any[]; // Empty array for now – define shape if needed
  ownerFullName: string;
  ownerUsername: string;
  ownerId: string;
  productType: string;
  videoDuration: number;
  isSponsored: boolean;
  musicInfo: {
    artist_name: string;
    song_name: string;
    uses_original_audio: boolean;
    should_mute_audio: boolean;
    should_mute_audio_reason: string;
    audio_id: string;
  };
};

export type LinkedInPost = {
  isRepost: boolean;
  urn: string;
  url: string;
  timeSincePosted: string;
  shareUrn: string;
  text: string;
  attributes: any[]; // Can be typed more specifically if needed
  comments: any[];
  reactions: any[];
  numShares: number;
  numLikes: number;
  numComments: number;
  numImpressions: number | null;
  canReact: boolean;
  canPostComments: boolean;
  canShare: boolean;
  allowedCommentersScope: string;
  authorProfilePicture: string;
  authorType: string;
  authorProfileId: string;
  authorFollowersCount: string;
  authorName: string;
  authorProfileUrl: string;
  authorUrn: string;
  postedAtTimestamp: number;
  postedAtISO: string;
  type: string;
  linkedinVideo?: {
    videoPlayMetadata: {
      duration: number;
      thumbnail: {
        artifacts: {
          width: number;
          digitalmediaAsset: string;
          fileIdentifyingUrlPathSegment: string;
          expiresAt: number;
          height: number;
        }[];
        rootUrl: string;
      };
      progressiveStreams: {
        streamingLocations: {
          url: string;
          expiresAt: number;
        }[];
        size: number;
        bitRate: number;
        width: number;
        height: number;
        mediaType: string;
      }[];
      transcripts: {
        captionFormat: string;
        locale: {
          country: string;
          language: string;
        };
        captionFile: string;
        isAutogenerated: boolean;
      }[];
      entityUrn: string;
      provider: string;
      aspectRatio: number;
      media: string;
      adaptiveStreams: {
        initialBitRate: number;
        protocol: string;
        mediaType: string;
        masterPlaylists: {
          url: string;
          expiresAt: number;
        }[];
      }[];
      trackingId: string;
    };
  };
  commentingDisabled: boolean;
  rootShare: boolean;
  shareAudience: string;
  author: {
    name: string;
    universalName: string;
    trackingId: string;
    active: boolean;
    showcase: boolean;
    entityUrn: string;
    logoUrl: string;
  };
  inputUrl: string;
};

type TweetMediaVariant = {
  bitrate?: number;
  content_type: string;
  url: string;
};

type TweetMediaSize = {
  h: number;
  w: number;
  resize: "fit" | "crop";
};

type TweetMedia = {
  display_url: string;
  expanded_url: string;
  id_str: string;
  indices: number[];
  media_key: string;
  media_url_https: string;
  type: string;
  url: string;
  additional_media_info: {
    monetizable: boolean;
  };
  ext_media_availability: {
    status: string;
  };
  sizes: {
    large: TweetMediaSize;
    medium: TweetMediaSize;
    small: TweetMediaSize;
    thumb: TweetMediaSize;
  };
  original_info: {
    height: number;
    width: number;
    focus_rects: any[];
  };
  allow_download_status: {
    allow_download: boolean;
  };
  video_info?: {
    aspect_ratio: [number, number];
    duration_millis: number;
    variants: TweetMediaVariant[];
  };
  media_results: {
    result: {
      media_key: string;
    };
  };
};

type TweetAuthor = {
  type: string;
  userName: string;
  url: string;
  twitterUrl: string;
  id: string;
  name: string;
  isVerified: boolean;
  isBlueVerified: boolean;
  profilePicture: string;
  description: string;
  location: string;
  followers: number;
  following: number;
  status: string;
  canDm: boolean;
  canMediaTag: boolean;
  createdAt: string;
  entities: {
    description: {
      urls: string[];
    };
  };
  fastFollowersCount: number;
  favouritesCount: number;
  hasCustomTimelines: boolean;
  isTranslator: boolean;
  mediaCount: number;
  statusesCount: number;
  withheldInCountries: string[];
  affiliatesHighlightedLabel: Record<string, unknown>;
  possiblySensitive: boolean;
  pinnedTweetIds: string[];
};

export type XPost = {
  type: string;
  id: string;
  url: string;
  twitterUrl: string;
  text: string;
  fullText: string;
  source: string;
  retweetCount: number;
  replyCount: number;
  likeCount: number;
  quoteCount: number;
  viewCount: number;
  createdAt: string;
  lang: string;
  bookmarkCount: number;
  isReply: boolean;
  conversationId: string;
  possiblySensitive: boolean;
  isPinned: boolean;
  author: TweetAuthor;
  extendedEntities?: {
    media: TweetMedia[];
  };
  card: Record<string, unknown>;
  place: Record<string, unknown>;
  entities: {
    hashtags: string[];
    media: TweetMedia[];
    symbols: any[];
    timestamps: any[];
    urls: any[];
    user_mentions: any[];
  };
  isRetweet: boolean;
  isQuote: boolean;
  media: string[];
  isConversationControlled: boolean;
};

export type YouTubePost = {
  id: string;
  title: string;
  url: string;
  viewCount: number;
  fromYTUrl: string;
  thumbnailUrl: string;
  type: string; // "shorts"
  duration: string;
  channelName: string;
  channelUsername: string;
  channelUrl: string;
  date: string;
  input: string;
  order: number;
  aboutChannelInfo: {
    channelDescription: string | null;
    channelJoinedDate: string;
    channelDescriptionLinks: string[];
    channelLocation: string | null;
    channelUsername: string;
    channelAvatarUrl: string;
    channelBannerUrl: string | null;
    channelTotalVideos: number;
    channelTotalViews: number;
    numberOfSubscribers: number;
    isChannelVerified: boolean;
    channelName: string;
    channelUrl: string;
    channelId: string;
    inputChannelUrl: string;
    isAgeRestricted: boolean;
  };
  fromChannelListPage: string;
  progressKey: {
    url: string;
    label: string;
  };
  standardizedUrl: string;
  channelDescription: string | null;
  channelJoinedDate: string;
  channelDescriptionLinks: string[];
  channelLocation: string | null;
  channelAvatarUrl: string;
  channelBannerUrl: string | null;
  channelTotalVideos: number;
  channelTotalViews: number;
  numberOfSubscribers: number;
  isChannelVerified: boolean;
  channelId: string;
  inputChannelUrl: string;
  isAgeRestricted: boolean;
  comments: any | null;
  likes: number;
  commentsCount: number;
  descriptionLinks: string[] | null;
  isMonetized: boolean | null;
  subtitles: any | null;
  text: string;
  hashtags: string[];
  formats: any | null;
  isMembersOnly: boolean;
};
