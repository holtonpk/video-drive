import type {VideoData, VideoRowConfig, RowCriterion} from "./data/types";

export const USE_HARDCODED_HOMEPAGE_ROWS =
  process.env.NEXT_PUBLIC_USE_HARDCODED_HOMEPAGE_ROWS === "false";

function matchesCriterion(video: VideoData, criterion: RowCriterion): boolean {
  const fieldValue = video[criterion.field];

  if ("value" in criterion) {
    if (Array.isArray(fieldValue)) {
      return fieldValue.includes(String(criterion.value));
    }
    return fieldValue === criterion.value;
  }

  if (!Array.isArray(fieldValue)) {
    return false;
  }

  const matches = criterion.values.filter((value) =>
    fieldValue.includes(String(value)),
  ).length;

  switch (criterion.match) {
    case "all":
      return matches === criterion.values.length;
    case "any":
      return matches > 0;
    case "atLeast":
      return matches >= (criterion.minCount ?? 1);
    default:
      return false;
  }
}

export const videoRowConfigs: VideoRowConfig[] = [
  {
    label: "Best hooks",
    href: "/launch-library/hooks/great",
    criteria: [{field: "hook", values: ["Great"], match: "any"}],
    sortBy: "score",
    sortDirection: "desc",
    limit: 20,
    videoIds: [
      "1917624993183326333",
      "1927092374431211827",
      "1956053210294001877",
      "1998860272069652801",
      "2023804644322160848",
      "1914348403611312140",
      "1920539678429888531",
      "1920901582499045881",
      "1942267367486283985",
      "1962923480879608063",
      "1983247395182776379",
      "1985752969498018269",
      "2018731211737137341",
      "2023789545242710115",
      "2024574709518782665",
      "2029950132754731188",
      "2031158094269423706",
      "1887561899635843143",
      "1945196673199735232",
    ],
  },
  {
    label: "Best abstract",
    href: "/launch-library/creative-format/abstract",
    criteria: [{field: "creativeFormat", values: ["Abstract"], match: "any"}],
    sortBy: "score",
    sortDirection: "desc",
    limit: 20,
    videoIds: [
      "1924948247618920780",
      "1948465725775270235",
      "1963310947470344353",
      "1978476332658073793",
      "1985391530090127424",
      "1985769015881715775",
      "1986146628970160225",
      "1988320904926130562",
      "1989060772723585237",
      "1995493093869596905",
      "2021981371808522497",
      "2026341356910624956",
      "2028470381556977845",
      "1926367782058303624",
      "1950270100201967892",
      "1952399136067870957",
      "1958257733326471218",
      "1978889240076521870",
      "1981435536381530599",
      "1985784108652609823",
    ],
  },
  {
    label: "Best DIY",
    href: "/launch-library/creative-format/diy",
    criteria: [{field: "creativeFormat", values: ["DIY"], match: "any"}],
    sortBy: "score",
    sortDirection: "desc",
    limit: 20,
    videoIds: [
      "1890461003269476455",
      "2028553427824119842",
      "2031762076155122011",
      "1891578370263245198",
      "1895609930670862809",
      "1910377235649040765",
      "1920982941901246582",
      "1922018948297720272",
      "1945498665398796776",
      "1953093710184669438",
      "1960794447349997999",
      "1967589227350155336",
      "1984713720531206205",
      "1987218566769266766",
      "1988339419150180604",
      "1991587191806697917",
      "1884632601224163830",
      "1891601897179447558",
      "1894181847606964513",
      "1897029281806496158",
    ],
  },
  {
    label: "AI Generated",
    href: "/launch-library/production/ai-generated",
    criteria: [{field: "production", values: ["AI Generated"], match: "any"}],
    sortBy: "score",
    sortDirection: "desc",
    limit: 20,
    videoIds: [
      "1914753583909888362",
      "1978158867499331586",
      "1978176112740950504",
      "1998499681194881178",
      "2011479673424011696",
      "2029980336029946055",
      "2030357816096297409",
      "2031384589898539341",
      "1953894337106128950",
      "1978506484704280810",
      "1983564490953372099",
      "1984319459784298576",
      "1985723718308675931",
      "1988607654483427680",
      "2008618319289672180",
      "2016194498343424053",
      "2018708558284562460",
      "2019078498799767605",
      "2019833475126227299",
      "2021992696454250749",
    ],
  },
  {
    label: "Best B 2 B",
    href: "/launch-library/industry/b2b",
    criteria: [{field: "industry", values: ["B2B"], match: "any"}],
    sortBy: "score",
    sortDirection: "desc",
    limit: 20,
    videoIds: [
      "1919784222455222777",
      "1922698429660119331",
      "1925937390822039991",
      "1930338950494990453",
      "1935434845653713100",
      "1957820171680170427",
      "1968701548135071772",
      "1970176276037329128",
      "1970573884442460196",
      "1975224529002844516",
      "1983646079095902309",
      "1986403196055486680",
      "1986508911923662924",
      "2018799155871903814",
      "2028898256802201794",
      "1894779464376008850",
      "1895277748014198909",
      "1904931703141130715",
      "1911816961232900207",
      "1917980670032482697",
    ],
  },
  {
    label: "Best B 2 C",
    href: "/launch-library/industry/b2c",
    criteria: [{field: "industry", values: ["B2C", "Consumer"], match: "any"}],
    sortBy: "score",
    sortDirection: "desc",
    limit: 20,
    videoIds: [
      "1927409468956193085",
      "1983232297487757690",
      "1983594690034499602",
      "2028878066630709455",
      "1925630365885935668",
      "1981767645138751813",
      "1986917284561207783",
      "1988366241460089118",
      "2019810821032047046",
      "2029225361679261831",
      "1898086247564034329",
      "1899135660142784728",
      "1900214860685943294",
      "1958182627422146811",
      "1986891391918882918",
      "1989045661854232854",
      "2016571983539122581",
      "2032119960219382265",
      "1917564603636068475",
      "1919769122042532108",
    ],
  },
  {
    label: "Live Action",
    href: "/launch-library/production/live-action",
    criteria: [{field: "production", values: ["Live Action"], match: "any"}],
    sortBy: "score",
    sortDirection: "desc",
    limit: 20,
    videoIds: [
      "1894447274756817044",
      "1955328433703227433",
      "2018383922099630298",
      "2031369491049808072",
      "2031490290457129009",
      "1890128820650537073",
      "1920572365265907728",
      "1923015523773690141",
      "1923045712008192202",
      "1924178174914498808",
      "1926031180584907157",
      "1927741652824686622",
      "1928481532135583997",
      "1942619551176544444",
      "1942992145683521723",
      "1944805724053496229",
      "1950239900197957811",
      "1953501390355280298",
      "1954920751439728700",
      "1957834946032120040",
    ],
  },
  {
    label: "Animated Motion Graphics",
    href: "/launch-library/production/animated-motion-graphics",
    criteria: [
      {
        field: "production",
        values: ["Motion Graphics", "3D Animation", "Animated"],
        match: "any",
      },
    ],
    sortBy: "score",
    sortDirection: "desc",
    limit: 20,
    videoIds: [
      "1891548166761349359",
      "1892288041047269585",
      "1893063830445420635",
      "1894861483991015528",
      "1919814423729918300",
      "1923426980361589015",
      "1925336277672681968",
      "1927515821405823465",
      "1929568692016419212",
      "1934992113911095639",
      "1937571433947050208",
      "1942947602141700569",
      "1947748483429240842",
      "1956294800568877226",
      "1962909130416701551",
      "1963618483499053244",
      "1963980445915238677",
      "1966290664586682835",
      "1968691488222503194",
      "1969461560642060680",
    ],
  },
  {
    label: "Humor",
    href: "/launch-library/tone/humor",
    criteria: [{field: "tone", values: ["Humour"], match: "any"}],
    sortBy: "score",
    sortDirection: "desc",
    limit: 20,
    videoIds: [
      "1981426646453219591",
      "1983262495235289257",
      "1984289282543247665",
      "2027428521157792067",
      "2028560981056790967",
      "2029633043699323025",
      "1922668234329006266",
      "1925612633434042829",
      "1935000734636081656",
      "1947718290412875979",
      "1950677797095276737",
      "1961111537113825446",
      "1978838639531393342",
      "1981042871097606219",
      "1986418298171641901",
      "1988715531516654022",
      "2021675609420943833",
      "2022022899180114020",
      "2028530785368920567",
      "2029255553768128547",
    ],
  },
];

/** Curated Top 10 order for production when `USE_HARDCODED_HOMEPAGE_ROWS` is true. */
export const TOP_TEN_VIDEO_IDS: string[] = [
  "1978176112740950504",
  "1963310947470344353",
  "1978158867499331586",
  "1985391530090127424",
  "1988320904926130562",
  "1924948247618920780",
  "1985769015881715775",
  "1894447274756817044",
  "2018383922099630298",
  "2018799155871903814",
];

function sortVideos(
  videos: VideoData[],
  sortBy?: keyof VideoData,
  direction: "asc" | "desc" = "desc",
): VideoData[] {
  if (!sortBy) return [...videos];

  return [...videos].sort((a, b) => {
    const aVal = a[sortBy] as string | number | null | undefined;
    const bVal = b[sortBy] as string | number | null | undefined;

    if (typeof aVal === "number" && typeof bVal === "number") {
      return direction === "desc" ? bVal - aVal : aVal - bVal;
    }

    const aStr = aVal != null ? String(aVal) : "";
    const bStr = bVal != null ? String(bVal) : "";
    const cmp = aStr.localeCompare(bStr, undefined, {numeric: true});

    return direction === "desc" ? -cmp : cmp;
  });
}

function getVideoKey(video: VideoData): string {
  return String(video.postId ?? video.name);
}

function createVideoMap(videos: VideoData[]): Map<string, VideoData> {
  return new Map(videos.map((video) => [getVideoKey(video), video]));
}

function getVideosByIds(videos: VideoData[], ids: string[]): VideoData[] {
  const videoMap = createVideoMap(videos);

  return ids
    .map((id) => videoMap.get(String(id)))
    .filter(Boolean) as VideoData[];
}

/** Discover top videos for dev when hardcoded lists are off (score, then views). */
function rankVideosForTopTenDiscover(videos: VideoData[]): VideoData[] {
  return [...videos]
    .sort((a, b) => {
      const as = a.score ?? 0;
      const bs = b.score ?? 0;
      if (bs !== as) return bs - as;
      return b.viewCount - a.viewCount;
    })
    .slice(0, 10);
}

export function getTopTenVideos(videos: VideoData[]): VideoData[] {
  return getVideosByIds(videos, TOP_TEN_VIDEO_IDS);
}

export function getVideosForRow(
  videos: VideoData[],
  config: VideoRowConfig,
): VideoData[] {
  const shouldUseHardcodedIds =
    USE_HARDCODED_HOMEPAGE_ROWS &&
    config.useHardcodedIds !== false &&
    Array.isArray(config.videoIds) &&
    config.videoIds.length > 0;

  if (shouldUseHardcodedIds) {
    let result = getVideosByIds(videos, config.videoIds!);

    if (config.limit != null && config.limit > 0) {
      result = result.slice(0, config.limit);
    }

    return result;
  }

  let result = videos.filter((video) =>
    config.criteria.every((criterion) => matchesCriterion(video, criterion)),
  );

  result = sortVideos(
    result,
    config.sortBy as keyof VideoData | undefined,
    config.sortDirection ?? "desc",
  );

  if (config.limit != null && config.limit > 0) {
    result = result.slice(0, config.limit);
  }

  return result;
}

export function buildVideoRows(
  videos: VideoData[],
  configs: VideoRowConfig[] = videoRowConfigs,
): Array<{config: VideoRowConfig; videos: VideoData[]}> {
  const usedVideoKeys = new Set<string>();

  return configs.map((config) => {
    const baseMatches = getVideosForRow(videos, {
      ...config,
      limit: undefined,
    });

    const uniqueMatches = baseMatches.filter(
      (video) => !usedVideoKeys.has(getVideoKey(video)),
    );

    const limit =
      config.limit != null && config.limit > 0
        ? config.limit
        : baseMatches.length;

    let selected = uniqueMatches.slice(0, limit);

    if (selected.length < limit) {
      const selectedKeys = new Set(selected.map(getVideoKey));

      const fallbackMatches = baseMatches.filter(
        (video) => !selectedKeys.has(getVideoKey(video)),
      );

      selected = [...selected, ...fallbackMatches].slice(0, limit);
    }

    selected.forEach((video) => {
      usedVideoKeys.add(getVideoKey(video));
    });

    return {
      config,
      videos: selected,
    };
  });
}
