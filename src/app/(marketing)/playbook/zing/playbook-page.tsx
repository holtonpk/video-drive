"use client";

import React, {useEffect, useRef, useState} from "react";
import localFont from "next/font/local";
import Overview from "./sections/overview";
import Overview2 from "./sections/overview2";
import ContentTypes from "./sections/content-types";
import OfferPackages from "./sections/offer-packages";
import Phases1 from "./sections/phases1";
import Phases2 from "./sections/phases2";
import KeyInsights from "./sections/key-insights";
import Summary from "./sections/summary";
import Measurement from "./sections/measurement";

const bodyFont = localFont({
  src: "../fonts/proximanova_regular.ttf",
});

const bodyFontLight = localFont({
  src: "../fonts/proximanova_light.otf",
});

type PlaybookSection = {
  id: string;
  label: string;
  children?: PlaybookSection[];
};

const sections: PlaybookSection[] = [
  {
    id: "overview",
    label: "Overview",
  },
  {
    id: "key-insights",
    label: "Key Insights",
  },
  {
    id: "content-types",
    label: "Content Types",
    children: [
      {
        id: "credibility-building",
        label: "Credibility Building",
      },
      {
        id: "relatability",
        label: "Relatability",
      },
      {
        id: "build-product",
        label: "Build Product",
      },
      {
        id: "niche-focuses",
        label: "Niche Focuses",
      },
    ],
  },
  {
    id: "offer-packages",
    label: "Offer / Packages",
  },
];

const sections2: PlaybookSection[] = [
  {
    id: "overview2",
    label: "Overview",
  },
  {
    id: "phases1",
    label: "Phase 1",
  },
  {
    id: "phases2",
    label: "Phase 2",
  },
  {
    id: "measurement",
    label: "Measurement and Success",
  },
  {
    id: "offer-packages",
    label: "Offer / Packages",
  },
];

const flatSections = sections.flatMap((section) => [
  {
    id: section.id,
    label: section.label,
  },
  ...(section.children ?? []),
]);

const flatSections2 = sections2.flatMap((section) => [
  {
    id: section.id,
    label: section.label,
  },
  ...(section.children ?? []),
]);

const allFlatSections = [...flatSections2, ...flatSections];

export const PlaybookPage = () => {
  const [activeSection, setActiveSection] = useState(allFlatSections[0].id);

  const clickedSectionRef = useRef<string | null>(null);
  const sidecarRef = useRef<HTMLElement | null>(null);
  const bodyContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frameId: number | null = null;
    let isFixed = false;

    const updateSidecarPosition = () => {
      const sidecar = sidecarRef.current;
      const bodyContainer = bodyContainerRef.current;

      if (!sidecar || !bodyContainer) return;

      const bodyRect = bodyContainer.getBoundingClientRect();
      const shouldBeFixed = bodyRect.top <= 0;

      if (shouldBeFixed === isFixed) return;

      isFixed = shouldBeFixed;

      if (shouldBeFixed) {
        sidecar.style.position = "fixed";
        sidecar.style.top = "24px";
        sidecar.style.left = `${bodyRect.left}px`;
        sidecar.style.maxHeight = "calc(100vh - 32px)";
        sidecar.style.overflowY = "auto";
      } else {
        sidecar.style.position = "absolute";
        sidecar.style.top = "0px";
        sidecar.style.left = "0px";
        sidecar.style.maxHeight = "";
        sidecar.style.overflowY = "";
      }
    };

    const requestUpdate = () => {
      if (frameId !== null) return;

      frameId = window.requestAnimationFrame(() => {
        updateSidecarPosition();
        frameId = null;
      });
    };

    updateSidecarPosition();

    window.addEventListener("scroll", requestUpdate, {passive: true});
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  useEffect(() => {
    const getActiveSection = () => {
      const clickedSection = clickedSectionRef.current;

      if (clickedSection) {
        const targetElement = document.getElementById(clickedSection);

        if (targetElement) {
          const targetTop = targetElement.offsetTop - 96;
          const distanceFromTarget = Math.abs(window.scrollY - targetTop);

          if (distanceFromTarget < 12) {
            clickedSectionRef.current = null;
          } else {
            setActiveSection(clickedSection);
            return;
          }
        }
      }

      const offset = 120;
      const trackingPoint = window.scrollY + offset;

      let currentSection = allFlatSections[0].id;

      allFlatSections.forEach((section) => {
        const element = document.getElementById(section.id);

        if (!element) return;

        const sectionTop = element.offsetTop;

        if (trackingPoint >= sectionTop) {
          currentSection = section.id;
        }
      });

      setActiveSection(currentSection);
    };

    getActiveSection();

    window.addEventListener("scroll", getActiveSection, {passive: true});
    window.addEventListener("resize", getActiveSection);

    return () => {
      window.removeEventListener("scroll", getActiveSection);
      window.removeEventListener("resize", getActiveSection);
    };
  }, []);

  const handleTabClick = (id: string) => {
    const element = document.getElementById(id);

    if (!element) return;

    clickedSectionRef.current = id;
    setActiveSection(id);

    const offset = 96;
    const top = element.offsetTop - offset;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen w-screen lg:pt-10">
      <div className="relative mx-auto max-w-6xl rounded-t-[12px] bg-white lg:p-4">
        <main>
          <Header />

          <div
            id="body-container"
            ref={bodyContainerRef}
            className="grid items-start gap-4 px-6 pt-6 lg:grid-cols-[240px_1fr] lg:px-0"
          >
            <div className="relative hidden min-h-full w-[240px] lg:block">
              <Sidecar
                ref={sidecarRef}
                activeSection={activeSection}
                onTabClick={handleTabClick}
              />
            </div>

            <div className="flex w-full flex-col items-center gap-16 pb-8">
              <section id="overview2" className="w-full scroll-mt-24">
                <Overview2 />
              </section>

              <section id="phases1" className="w-full scroll-mt-24">
                <Phases1 />
              </section>

              <section id="phases2" className="w-full scroll-mt-24">
                <Phases2 />
              </section>

              <section id="measurement" className="w-full scroll-mt-24">
                <Measurement />
              </section>

              <section id="summary" className="w-full scroll-mt-24">
                <Summary />
              </section>
              <div className="flex flex-col items-center w-full">
                <div className="w-full h-1 border-t-4 border-t-[#7F44F8]/20 border-dashed" />
                <p className="text-[#7F44F8]/20 text-lg">End of Plan 2</p>
              </div>

              <section id="overview" className="w-full scroll-mt-24 mt-10">
                <Overview />
              </section>

              <section id="key-insights" className="w-full scroll-mt-24">
                <KeyInsights />
              </section>

              <section id="content-types" className="w-full scroll-mt-24">
                <ContentTypes />
              </section>

              <section id="offer-packages" className="w-full scroll-mt-24">
                <OfferPackages />
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const Header = () => {
  return (
    <div className="relative flex h-fit flex-col items-center justify-center overflow-hidden border border-black/10 shadow-sm lg:h-[250px] lg:w-full lg:rounded-[16px] lg:p-4">
      <img
        src="/playbook/zing-header.png"
        className="w-full lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2"
      />
    </div>
  );
};

const Sidecar = React.forwardRef<
  HTMLElement,
  {
    activeSection: string;
    onTabClick: (id: string) => void;
  }
>(({activeSection, onTabClick}, ref) => {
  const isSectionActive = (section: PlaybookSection) => {
    return (
      activeSection === section.id ||
      section.children?.some((child) => child.id === activeSection)
    );
  };

  return (
    <aside
      ref={ref}
      className="absolute left-0 top-0 z-50 hidden h-fit w-[240px] overflow-y-auto rounded-[16px] px-4 lg:block"
    >
      <div>
        <h1
          className={`${bodyFontLight.className} mb-4 text-sm text-[#040537]`}
        >
          Table of contents
        </h1>

        <h1
          className={`${bodyFontLight.className} flex w-full items-center gap-1 whitespace-nowrap text-sm text-[#7F44F8]/40`}
        >
          <div className="h-[1px] w-6 bg-[#7F44F8]/20" />
          Plan 2
          <div className="h-[1px] w-full bg-[#7F44F8]/20" />
        </h1>

        <div className="mt-2 flex flex-col gap-2 pl-3">
          {sections2.map((section) => {
            const parentActive = isSectionActive(section);
            const hasChildren = Boolean(section.children?.length);

            return (
              <div key={section.id} className="flex flex-col gap-2">
                <button
                  onClick={() => onTabClick(section.id)}
                  className={`${bodyFont.className} relative text-left text-base transition-colors ${
                    parentActive
                      ? "font-semibold text-black"
                      : "text-black/45 hover:text-black"
                  }`}
                >
                  <span
                    className={`absolute -left-[13px] top-1/2 h-[5px] w-[5px] -translate-y-1/2 rounded-full transition-all ${
                      parentActive ? "bg-[#7F44F8]" : "bg-transparent"
                    }`}
                  />

                  <span className="block truncate">{section.label}</span>
                </button>

                {hasChildren && (
                  <div className="ml-5 flex flex-col gap-2 pl-3">
                    {section.children?.map((child) => {
                      const childActive = activeSection === child.id;

                      return (
                        <button
                          key={child.id}
                          onClick={() => onTabClick(child.id)}
                          className={`${bodyFont.className} relative text-left text-base transition-colors ${
                            childActive
                              ? "font-semibold text-black"
                              : "text-black/40 hover:text-black"
                          }`}
                        >
                          <span
                            className={`absolute -left-[13px] top-1/2 h-[5px] w-[5px] -translate-y-1/2 rounded-full transition-all ${
                              childActive ? "bg-[#7F44F8]" : "bg-transparent"
                            }`}
                          />

                          <span className="block truncate">{child.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <h1
          className={`${bodyFontLight.className} mt-4 flex w-full items-center gap-1 whitespace-nowrap text-sm text-[#7F44F8]/40`}
        >
          <div className="h-[1px] w-6 bg-[#7F44F8]/20" />
          Plan 1
          <div className="h-[1px] w-full bg-[#7F44F8]/20" />
        </h1>

        <div className="mt-2 flex flex-col gap-2 pl-3">
          {sections.map((section) => {
            const parentActive = isSectionActive(section);
            const hasChildren = Boolean(section.children?.length);

            return (
              <div key={section.id} className="flex flex-col gap-2">
                <button
                  onClick={() => onTabClick(section.id)}
                  className={`${bodyFont.className} relative text-left text-base transition-colors ${
                    parentActive
                      ? "font-semibold text-black"
                      : "text-black/45 hover:text-black"
                  }`}
                >
                  <span
                    className={`absolute -left-[13px] top-1/2 h-[5px] w-[5px] -translate-y-1/2 rounded-full transition-all ${
                      parentActive ? "bg-[#7F44F8]" : "bg-transparent"
                    }`}
                  />

                  <span className="block truncate">{section.label}</span>
                </button>

                {hasChildren && (
                  <div className="ml-5 flex flex-col gap-2 pl-3">
                    {section.children?.map((child) => {
                      const childActive = activeSection === child.id;

                      return (
                        <button
                          key={child.id}
                          onClick={() => onTabClick(child.id)}
                          className={`${bodyFont.className} relative text-left text-base transition-colors ${
                            childActive
                              ? "font-semibold text-black"
                              : "text-black/40 hover:text-black"
                          }`}
                        >
                          <span
                            className={`absolute -left-[13px] top-1/2 h-[5px] w-[5px] -translate-y-1/2 rounded-full transition-all ${
                              childActive ? "bg-[#7F44F8]" : "bg-transparent"
                            }`}
                          />

                          <span className="block truncate">{child.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
});

Sidecar.displayName = "Sidecar";
