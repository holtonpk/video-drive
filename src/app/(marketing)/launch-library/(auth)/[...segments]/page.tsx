import Link from "next/link";
import {notFound} from "next/navigation";
import {NavBar} from "../../../navbar";
import {Footer} from "../../../footer";
import {constructMetadata} from "@/lib/utils";
import {
  FIELD_CATEGORY_MAP,
  getDisplayFieldLabel,
  getFieldValueDisplayName,
  isValidFieldCategory,
  videoMatchesFieldRoute,
} from "../../data/field-routing";
import SearchResultsGrid from "../../search-results-grid";
import fieldDescriptions from "../../data/field-descriptions.json";
import {getLaunchLibraryVideos} from "../../data/get-launch-video";
import {Hero} from "./hero";

const typedFieldDescriptions = fieldDescriptions as Record<
  string,
  Record<string, {label?: string; description?: string}>
>;

type Props = {
  params: Promise<{segments: string[]}>;
};

async function resolveSegments(
  params: Props["params"],
): Promise<{segments: string[]}> {
  const p = await params;
  return {segments: p.segments ?? []};
}

export async function generateMetadata({params}: Props) {
  const {segments} = await resolveSegments(params);

  if (segments.length === 2) {
    const fieldCategory = decodeURIComponent(segments[0]).trim();
    const fieldValue = decodeURIComponent(segments[1]).trim();

    if (!isValidFieldCategory(fieldCategory)) {
      return constructMetadata({
        title: "Launch Library",
        description: "Filtered launch library videos",
      });
    }

    const fieldLabel = getDisplayFieldLabel(fieldCategory);
    const valueLabel = getFieldValueDisplayName(fieldValue);

    return constructMetadata({
      title: `${fieldLabel}: ${valueLabel} — Launch Library`,
      description: `Launch library videos filtered by ${fieldLabel} = ${valueLabel}`,
    });
  }

  return constructMetadata({
    title: "Launch Library",
    description: "A Human curated library of the best YC launch videos",
  });
}

const Page = async ({params}: Props) => {
  const {segments} = await resolveSegments(params);

  if (segments.length !== 2) {
    notFound();
  }

  const fieldCategory = decodeURIComponent(segments[0]).trim();
  const fieldValue = decodeURIComponent(segments[1]).trim();

  if (!isValidFieldCategory(fieldCategory)) {
    notFound();
  }

  const field = FIELD_CATEGORY_MAP[fieldCategory];
  const allVideos = await getLaunchLibraryVideos();

  const matchingVideos = allVideos.filter((video) =>
    videoMatchesFieldRoute(video, field, fieldValue),
  );

  if (matchingVideos.length === 0) {
    notFound();
  }

  const valueLabel = getFieldValueDisplayName(fieldValue);

  const fieldDescription =
    typedFieldDescriptions[fieldCategory]?.[fieldValue]?.description ?? "";

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <Link
        href="/launch-library"
        className="hidden sm:block absolute left-8 top-28 z-40 w-fit text-sm text-white/60 hover:text-white hover:underline"
      >
        ← Back to Launch Library
      </Link>
      <Hero
        fieldCategory={fieldCategory}
        valueLabel={valueLabel}
        description={fieldDescription}
      />

      <main className="flex flex-1 flex-col px-6 pt-0 pb-10 text-white">
        <div className="mt-8">
          <SearchResultsGrid title={""} videos={matchingVideos} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Page;
