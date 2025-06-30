export type ProcessData = {
  title: string;
  description: string;
  highlights: {
    title: string;
    description: string;
  }[];
};

export const Process = ({data}: {data: ProcessData}) => {
  return (
    <div className="bg-white py-40">
      <div className="container mx-auto flex flex-col gap-20">
        <div className="flex flex-col items-center text-center gap-4 max-w-[700px] mx-auto">
          <h1 className="relative big-text-bold text-8xl text-primary">
            {data.title}
          </h1>
          <p className="text-primary/70 small-text">{data.description}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-x-16">
          {data.highlights.map((highlight, index) => (
            <div
              key={index}
              className="border-t border-dashed py-10 flex flex-col gap-2 h-fit"
            >
              <h1 className="big-text-bold text-2xl text-primary h-fit">
                {highlight.title}
              </h1>
              <p className="text-primary/70 small-text h-fit">
                {highlight.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
