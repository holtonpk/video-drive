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
        <h1 className="relative big-text-bold text-8xl text-primary">
          {title}
        </h1>
        <p className="text-primary/70 small-text">{description}</p>
      </div>
      <div className="grid grid-cols-3 gap-10">
        {details.map((detail) => (
          <div key={detail.title} className="flex flex-col gap-2">
            <div className="flex items-end gap-2">
              <div
                className=" rounded-[12px] flex h-[50px] w-[50px] items-center justify-center"
                style={{background: color}}
              >
                {detail.icon}
              </div>
              <h1 className="big-text-bold text-3xl">{detail.title}</h1>
            </div>
            <p className="text-primary/70 small-text">{detail.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
