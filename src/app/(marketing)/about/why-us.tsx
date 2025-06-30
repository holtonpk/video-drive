import {Award, Chart, Arrows, ScreenCheck, Chat, UpTrend} from "../icons";

export const WhyUs = () => {
  const Reasons = [
    {
      title: "Battle Tested Results",
      description:
        "With 10+ years of winning campaigns under our belt, we know what drives results and we deliver every time.",
      icon: <Award />,
    },
    {
      title: "Data Driven Moves",
      description:
        "Every move we make is backed by data. We plan smart, execute fast, and optimize for growth you can measure.",
      icon: <Chart />,
    },
    {
      title: "Built for Speed and Impact",
      description:
        "We move fast, stay aligned, and communicate clearly turning complex projects into smooth, high-impact outcomes.",
      icon: <Arrows />,
    },
    {
      title: "End-to-End Execution",
      description:
        "From idea to execution, we handle it all. Strategy, production, distribution tied together with results that speak.",
      icon: <ScreenCheck />,
    },
    {
      title: "All Substance, No Fluff",
      description:
        "We skip the buzzwords and focus on what matters clear strategy, clean execution, and ROI you can see.",
      icon: <Chat />,
    },
    {
      title: "Short-Form That Sells",
      description:
        "Short-form is our specialty. We blend creativity and strategy to build scroll-stopping content that converts.",
      icon: <UpTrend />,
    },
  ];

  return (
    <div className="container mx-auto py-40 flex flex-col gap-16 items-center dark  bg-background text-primary">
      <div className="flex flex-col items-center text-center gap-4 max-w-[500px]">
        <h1 className="relative big-text-bold text-8xl text-primary">
          What makes us different?
        </h1>
        <p className="text-primary/70 small-text">
          Bold strategies. Proven expertise. Real results. We combine
          creativity, strategy, and execution to drive measurable growth and
          lasting impact.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-16">
        {Reasons.map((point, index) => (
          <div className="flex flex-col gap-4" key={index}>
            <div className="flex items-end gap-4">
              <div className="bg-theme-color3 rounded-[12px] flex h-[50px] w-[50px] items-center justify-center">
                {point.icon}
              </div>
              <h1 className="big-text-bold text-2xl">{point.title}</h1>
            </div>
            <p className="text-primary/70 small-text">{point.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
