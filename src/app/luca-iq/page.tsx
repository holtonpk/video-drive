import React from "react";
import Image from "next/image";
import {IBM_Plex_Sans, IBM_Plex_Mono, Source_Serif_4} from "next/font/google";
import {constructMetadata} from "@/lib/utils";

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const displayFont = Source_Serif_4({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata = constructMetadata({
  title: "Luca IQ Launch Video",
  description: "Messaging and structure brief for the Luca IQ launch video.",
});

const INK = "#161512";
const PAPER_2 = "#ecead8";
const ACCENT = "#1a4a8a";
const RULE_HAIR = "#1615121a";

const messagingPoints = [
  "Every return in the country runs through an engine.",
  "Those engines are stuck in 1996 and connect to nothing.",
  "Luca IQ is the first modern one. Deterministic, reliable, API first.",
  "Built by people who lived the problem. A CPA and an engineer.",
  "The infrastructure the next era of tax gets built on.",
];

const audiences = [
  {
    name: "CPA firms",
    tag: "Primary buyer",
    description:
      "The heart of the video. File through an engine today, stuck with four options that connect to nothing. Want modern, connected, dependable. Not AI. Reliability.",
  },
  {
    name: "Tax tech builders",
    tag: "The platform play",
    description: "Forced to wire into ancient engines. One API, plug in, file.",
  },
  {
    name: "Investors",
    tag: "A viewer, not a user",
    description:
      "We don't talk to them. They feel the scale and the inevitability on their own.",
  },
];

const structureOptions = [
  {
    id: "V1.0",
    name: "Problem to solution",
    steps: [
      "Stakes: every return runs through an engine.",
      "Problem: stuck in 1996.",
      "Solution: the first modern one. Deterministic, reliable, API first.",
      "Proof: a CPA and an engineer who lived this.",
      "Vision: the infrastructure everything gets built on.",
    ],
  },
  {
    id: "V1.1",
    name: "Credibility first",
    steps: [
      "Who you are and why you'd be the ones to build this.",
      "Stakes.",
      "Problem.",
      "Solution.",
      "Vision.",
    ],
  },
  {
    id: "V1.2",
    name: "Cinematic cold open",
    steps: [
      "Open cold on the old world before anyone speaks. Let the visual hook. “Dramatize the problem in the first 10 seconds”",
      "Founders enter, name the problem, reveal the fix.",
      "Solution and the determinism argument.",
      "Vision.",
    ],
  },
];

const openQuestions = [
  {
    title: "Testimonial",
    description:
      "Leaning against it. Only worth including if the customer has actually used the engine. If he's praising the workflow product you're live with today, he's praising the replaceable part, and it muddies the message. I think your experience as a team holds enough credibility on its own, making the testimonial unnecessary.",
  },
  {
    title: "UI",
    description:
      "Real product, stylized for film, or a built mockup. Tell us what's realistic to have ready.",
  },
  {
    title: "Do you think we are correct on how we approach “AI” being used?",
    description: "",
  },
];

const launchExamples = [
  {
    name: "Sazabi",
    url: "https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/2037197888481108150-sazabi.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=R6vwBVO%2BvUSWVpRqgnGZeX4a58UQ5x7VxU276ify%2FQ%2Bf4H6USxcJrp25vHiZtmXqFXyoQ9qcrXXnpyoPpSZ9raeovhPzolQ6pErgkpSVpopbyrNH%2F8r40IdOsqlGT42nkc83rmJMqZZ0eI3x1UYacWopn%2Bu1Irms%2BBXnr3hnpmUqWgKpd0IZUOasi7opiDtrJ8bYjIBiXFWeuN8LDSihvO%2FjDDiOs%2FINjuNhFwjerKQgSfFAPr%2BkAdEq%2FuZLGK3couvq6%2BsvMs8Ii7FE29yPi%2BpakOoxB%2FB7lTaqkIawl06sPqx5Z%2BkG29kHCnnYLe45%2BXzZCPGhep31LjJ4X%2FJd7g%3D%3D",
    description:
      "This is a great example of a founder led launch. The flow is credibility, context, problem, opportunity, then solution (with the 3 point walkthrough), CTA. I pulled this example to show you what a convicting founder looks like. The founder has a great tone and cadence in his delivery. This could be a good video to take inspiration from in building the script given your background. We could start with a “My name is Angelo and I have worked as a CPA on Wall Street for years and…”",
  },
  {
    name: "Soria",
    url: "https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/2061840263975243932-soria.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=Ak6qKfBNqos4U%2FoIaUOWsRy2%2BHCxrGkAJ08H0FGQbLR2qi3t%2B1C27xVKFhGKBaJFcR7xvirZuXLl%2F2L31NQVVrtD%2B31j66%2FT2uHFwfTOIDZmApSzMhfjIX0fHOcuo%2FB95xE4TOZJKN4HAXd%2FmRiBHR%2FUIo%2Ft%2FRywwADFzz%2BuSh1anp%2B4nf8%2BTPrqKzRhj5aJA1Vdw7R%2FEeN3E4%2BvQAjQHcav67un2werO31kYYWQDPJExKiG26t7a8yr1%2BnaDHJRHGIwx57yQ6nLZQOUM48DbtK0Zc%2B1MMa7%2FZtcapQgezz%2BstTo7e11OmM3k5na8q805EOw9IK%2FOu05nmYCcNb%2FBQ%3D%3D",
    description:
      "This founder dynamic is good. The founder (Adam), with Industry experience at Bank of America, opens up with the problem, then the technical founder (Cameron) details the solution.",
  },
  {
    name: "DiligenceSquared",
    url: "https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/1986569340691620116-diligencesquared.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=aW9ULvfnfGd12GLQ%2B3rIUHfjfRjyBMGoZb%2Bw9wlLBkh4gHexvO0V5MCE8PF20Wwi12adBrCVZ0TeUY%2FpCHT4ynl9hgvWwcfdYhUMZlySPYxrfD57AaBgfHHkt%2FMpS7OLLLz2Scsdk20XaKOwX85unGXNicxtL%2FttjHnlDAMEE43hRKn%2BPjiO8l8Erk1udKlvSo0WSpktI3zS5fPO2%2BXeS8vyVknCbJgHCBtkEd7CKOuFahAMH5olQ4r6uYKvYlTsr7xWKSFtrL6voO2duqKLnJdt1XpRbBzLtv6ktOqdS3YQ5uGNg4aNklFbTkW%2Ffd16OpDWl11BQmbSWOK%2B%2F5YCmw%3D%3D",
    description:
      "This launch has a very polished and professional feel, another great reference.",
  },
  {
    name: "Raspire",
    url: "https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/2062625437835227366-raspire.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=cy%2FsBx7Kb%2B09Bk8y%2Fs5AcdWrRfTUb8rLCVP5f3J%2F44K%2ByH7Ez53I3cXlRgQV5v27MWomtXyzczBMhdANHu8HyEhGu5EO09YNIYA1rOxFrpTDIu10tSw%2BS6LPZV8VdMhPK4%2Bu02YMLjadULK7%2B5kmuSXTVpbr8VT%2FUOxQE4PhdL17t%2FWVQUccFZVXA0yAXHOl%2F640tiN0VQuGRyP0yGTH1oIRN8tUOLH0m3hJ9A%2Bv8zh8SPPlzww3zXXBOttftnXgSgv58kbIfWD2AESqsVkbdvw4GT7yjj%2BBC0EIzL3eRupSS6Nvu%2F%2FXD0v4jp27HjkPwq9PJNGd%2B01a2NpqnXvJ8w%3D%3D",
    description:
      "This launch uses great motion graphics. The video “magic” really helps with engagement. We will add some of these elements on top of the footage.",
  },
  {
    name: "Qomplement",
    url: "https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/2057144326489063935-qomplement.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=L%2BlLbjYXHL3jVtVqBnjPvWNfwKKH6s%2FpQZDyECy1APD6yzMzOUinoSmwZgw5%2BDJa6a2Z85MN9FNigNV3ZYL%2FwtzG6FwmjRkUsgB8B9xs5G%2BO1PTk9r2qzlOctesfYguefag%2BW1J1QqBSLg17DUp%2FzSFO0ZhGSz9QQmHUq%2B%2Fi9tOAQtb829B529%2BPSB00VMpoD0wkHrCIIisss0X5EJKqMXbj%2BU4oMkSNdJVFUDFDSoM%2BMO%2Fy%2BvNgU9O0qKbf3ziSk6z%2Byr%2FADujunxWNYXSdBMarlRVqc0FTWIwAo01SOrIlp5MnRozNBfF08BxWgJTT0V2i50BVcRpMUp2iEn7P8w%3D%3D",
    description:
      "This launch does a good job of speaking to the customer up front. It shows he understands the problem off the bat. This is close to the cinematic opening we detailed. The problem is that logistics is much easier to dramatize than accounting.",
  },
];

const Eyebrow = ({children}: {children: React.ReactNode}) => (
  <p
    className={`text-xs uppercase tracking-[0.14em] mb-2`}
    style={{color: ACCENT, fontFamily: monoFont.style.fontFamily}}
  >
    {children}
  </p>
);

const SectionHeading = ({number, title}: {number: string; title: string}) => (
  <div className="flex flex-col gap-3">
    <Eyebrow>{number}</Eyebrow>
    <h2
      className={`text-3xl sm:text-4xl ${displayFont.className}`}
      style={{color: INK, fontWeight: 400, letterSpacing: "-0.01em"}}
    >
      {title}
    </h2>
    <hr style={{borderColor: RULE_HAIR}} />
  </div>
);

const Page = () => {
  return (
    <div
      className={`min-h-screen ${bodyFont.className}`}
      style={{backgroundColor: "#f5f1ea", color: INK}}
    >
      {/* Minimal identity bar — not the real site nav */}
      <header
        className="border-b"
        style={{borderColor: RULE_HAIR, backgroundColor: "#f5f1ea"}}
      >
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <Image
            src="/luca-iq/logo.svg"
            alt="Luca IQ"
            width={110}
            height={37}
            priority
          />
          <span
            className="text-xs uppercase tracking-[0.14em]"
            style={{color: ACCENT, fontFamily: monoFont.style.fontFamily}}
          >
            Internal · Launch Video Brief
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 pt-16 pb-16 max-w-[820px]">
        <Eyebrow>Luca IQ</Eyebrow>
        <h1
          className={`text-5xl sm:text-6xl mb-5 ${displayFont.className}`}
          style={{
            color: INK,
            fontWeight: 360,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          Launch video brief.
        </h1>
        <p className="text-lg" style={{color: "#6a655e"}}>
          Messaging, audience, and structure for the Luca IQ launch video.
        </p>
      </section>

      <div className="container mx-auto px-6 flex flex-col gap-20 pb-32 max-w-[900px]">
        {/* Messaging */}
        <section className="flex flex-col gap-6">
          <SectionHeading number="01 · Messaging" title="The Messaging" />
          <p style={{color: "#3a3633"}} className="text-lg max-w-[680px]">
            This is what the viewer should clearly walk away with after
            watching:
          </p>
          <ol className="flex flex-col">
            {messagingPoints.map((point, index) => (
              <li
                key={index}
                className="flex gap-5 items-start py-4 border-b"
                style={{borderColor: RULE_HAIR}}
              >
                <span
                  className="text-sm w-6 shrink-0 pt-1"
                  style={{color: ACCENT, fontFamily: monoFont.style.fontFamily}}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-lg" style={{color: INK}}>
                  {point}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* AI Question */}
        <section className="flex flex-col gap-6">
          <SectionHeading number="02 · Positioning" title="The AI Question" />
          <div
            className="flex flex-col gap-4 max-w-[680px] rounded-[8px] p-6"
            style={{backgroundColor: PAPER_2}}
          >
            <p className="text-lg" style={{color: "#3a3633"}}>
              Luca IQ is AI native, but AI is the wrong word to lead with. As
              you mentioned CPA firms distrust it and don&apos;t want AI near
              their clients&apos; taxes.
            </p>
            <p className="text-lg" style={{color: "#3a3633"}}>
              So we keep AI quiet and lead with determinism. Same answer every
              time. Tax law as code. 2 + 2 = 4, every filing. That&apos;s the
              trust argument, and trust needs to be the focus.
            </p>
            <p className="text-lg" style={{color: "#3a3633"}}>
              AI still lives in the video, just underneath: how you built it
              this fast, the intelligent layer around the core. Loud on
              reliability, quiet on AI.
            </p>
          </div>
        </section>

        {/* Audience */}
        <section className="flex flex-col gap-6">
          <SectionHeading number="03 · Audience" title="Audience" />
          <div
            className="grid md:grid-cols-3 gap-px"
            style={{backgroundColor: RULE_HAIR}}
          >
            {audiences.map((audience) => (
              <div
                key={audience.name}
                className="flex flex-col gap-3 p-6"
                style={{backgroundColor: "#f5f1ea"}}
              >
                <span
                  className="text-xs uppercase tracking-[0.1em]"
                  style={{color: ACCENT, fontFamily: monoFont.style.fontFamily}}
                >
                  {audience.tag}
                </span>
                <h3
                  className={`text-xl ${displayFont.className}`}
                  style={{color: INK}}
                >
                  {audience.name}
                </h3>
                <p className="text-base" style={{color: "#6a655e"}}>
                  {audience.description}
                </p>
              </div>
            ))}
          </div>
          <p style={{color: "#3a3633"}} className="text-lg max-w-[680px]">
            CPA firm is the heart. Builder value is mentioned in a sentence or
            two.
          </p>
        </section>

        {/* Video Characteristics */}
        <section className="flex flex-col gap-6">
          <SectionHeading
            number="04 · Direction"
            title="Video Characteristics"
          />
          <div className="flex flex-col gap-4 max-w-[680px]">
            <p className="text-lg" style={{color: "#3a3633"}}>
              Founder led, both of you. CPA plus engineer is made clear. You
              carry why it&apos;s broken. He carries why it holds.
            </p>
            <p className="text-lg" style={{color: "#3a3633"}}>
              Premium, clean, trustworthy. The video has to feel as reliable as
              the product.
            </p>
            <p className="text-lg" style={{color: "#3a3633"}}>
              Two visual anchors: 1996 software versus what you&apos;re
              building, and 40 million words in tax code made tangible.
            </p>
            <div
              className="rounded-[8px] p-5 border-l-4"
              style={{backgroundColor: "#1a4a8a14", borderColor: ACCENT}}
            >
              <p
                className="text-xs uppercase tracking-[0.1em] mb-2"
                style={{color: ACCENT, fontFamily: monoFont.style.fontFamily}}
              >
                Hard rule
              </p>
              <p className="text-lg font-medium" style={{color: INK}}>
                It cannot look AI generated. No synthetic voiceover, no uncanny
                anything. Real faces, real voices, real or convincing UI.
              </p>
            </div>
          </div>
        </section>

        {/* Structure Options */}
        <section className="flex flex-col gap-6">
          <SectionHeading number="05 · Structure" title="Structure Options" />
          <p style={{color: "#3a3633"}} className="text-lg max-w-[680px]">
            Safe and clear to bold and cinematic. Same messaging, different
            feel.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {structureOptions.map((option) => (
              <div
                key={option.id}
                className="flex flex-col gap-4 p-6 rounded-[8px] border"
                style={{borderColor: RULE_HAIR, backgroundColor: "#fff"}}
              >
                <div className="flex flex-col gap-1">
                  <span
                    className="text-xs uppercase tracking-[0.1em]"
                    style={{
                      color: ACCENT,
                      fontFamily: monoFont.style.fontFamily,
                    }}
                  >
                    {option.id}
                  </span>
                  <h3
                    className={`text-xl ${displayFont.className}`}
                    style={{color: INK}}
                  >
                    {option.name}
                  </h3>
                </div>
                <ol className="flex flex-col gap-3">
                  {option.steps.map((step, index) => (
                    <li
                      key={index}
                      className="flex gap-3 text-sm"
                      style={{color: "#6a655e"}}
                    >
                      <span
                        style={{
                          color: ACCENT,
                          fontFamily: monoFont.style.fontFamily,
                        }}
                      >
                        {index + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* Open Questions */}
        <section className="flex flex-col gap-6">
          <SectionHeading number="06 · Open Questions" title="Open Questions" />
          <div className="flex flex-col">
            {openQuestions.map((question, index) => (
              <div
                key={question.title}
                className="flex gap-5 items-start py-5 border-b"
                style={{borderColor: RULE_HAIR}}
              >
                <span
                  className="text-sm w-6 shrink-0 pt-1"
                  style={{
                    color: ACCENT,
                    fontFamily: monoFont.style.fontFamily,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold" style={{color: INK}}>
                    {question.title}
                  </h3>
                  {question.description ? (
                    <p className="text-base" style={{color: "#6a655e"}}>
                      {question.description}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Relevant Launch Examples */}
        <section className="flex flex-col gap-6">
          <SectionHeading
            number="07 · References"
            title="Relevant Launch Examples"
          />
          <div className="flex flex-col gap-10">
            {launchExamples.map((example) => (
              <div key={example.name} className="flex flex-col gap-4">
                <h3
                  className={`text-xl ${displayFont.className}`}
                  style={{color: INK}}
                >
                  {example.name}
                </h3>
                <video
                  src={example.url}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full max-h-[520px] rounded-[8px] border bg-black"
                  style={{borderColor: RULE_HAIR}}
                />
                <p className="text-base max-w-[680px]" style={{color: "#6a655e"}}>
                  {example.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer
        className="border-t"
        style={{borderColor: RULE_HAIR, backgroundColor: "#f5f1ea"}}
      >
        <div
          className="container mx-auto px-6 py-6 text-xs uppercase tracking-[0.1em]"
          style={{color: "#a09a90", fontFamily: monoFont.style.fontFamily}}
        >
          Prepared by Ripple Media for Luca IQ
        </div>
      </footer>
    </div>
  );
};

export default Page;
