import localFont from "next/font/local";

const h1Font = localFont({
  src: "../../../fonts/HeadingNow-56Bold.ttf",
});

const h1FontTest = localFont({
  src: "../../../fonts/HeadingNow-56Bold.ttf",
});

const bigFontTest = localFont({
  src: "../../../fonts/HeadingNow-57Extrabold.ttf",
});

const bodyFont = localFont({
  src: "../../../fonts/proximanova_light.otf",
});

export const Hero = ({
  fieldCategory,
  valueLabel,
  description,
}: {
  fieldCategory: string;
  valueLabel: string;
  description?: string;
}) => {
  return (
    <div className="container mx-auto relative flex flex-col items-center pt-10 gap-6">
      <div className="flex max-w-[800px] flex-col gap-6 items-center">
        <div
          className={`px-3 py-2 border-2 border-theme-color1 uppercase rounded-[8px] text-2xl w-fit -rotate-6 ${bigFontTest.className}`}
        >
          {fieldCategory}
        </div>
        <h1
          className={`text-7xl md:text-8xl text-theme-color3 uppercase text-center relative z-20  big-text ${h1Font.className}`}
        >
          {valueLabel}
        </h1>
        {description && (
          <p
            className={`text-xl small-text text-primary/70 text-center ${bodyFont.className}`}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
