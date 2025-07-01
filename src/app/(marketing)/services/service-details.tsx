import localFont from "next/font/local";

const h1Font = localFont({
  src: "../fonts/HeadingNowTrial-56Bold.ttf",
});

const h2Font = localFont({
  src: "../fonts/HeadingNowTrial-55Medium.ttf",
});

const bodyFont = localFont({
  src: "../fonts/proximanova_light.otf",
});

export type ServiceDetail = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

export const ServiceDetails = ({
  details,
  title,
  description,
  color,
}: {
  details: ServiceDetail[];
  title: string;
  description: string;
  color: string;
}) => {
  return (
    <div className="container mx-auto py-40 flex flex-col gap-16 items-center   bg-white text-primary">
      <div className="flex flex-col items-center text-center gap-4 max-w-[500px]">
        <h1
          className={`relative text-8xl text-primary uppercase ${h1Font.className}`}
        >
          {title}
        </h1>
        <p className={`text-primary/70 text-xl ${bodyFont.className}`}>
          {description}
        </p>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
        {details.map((detail) => (
          <div key={detail.title} className="flex flex-col gap-2">
            <div className="flex items-end gap-2">
              <div
                className=" rounded-[12px] flex h-[50px] w-[50px] items-center justify-center"
                style={{background: color}}
              >
                {detail.icon}
              </div>
              <h1 className={`text-2xl uppercase ${h2Font.className}`}>
                {detail.title}
              </h1>
            </div>
            <p className={`text-primary/70 text-xl ${bodyFont.className}`}>
              {detail.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
