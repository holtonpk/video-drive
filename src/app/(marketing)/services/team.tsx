import React from "react";
import {Team as TeamComponent} from "../(landing)/team";

export const Team = () => {
  return (
    <div className="bg-background dark py-40">
      <TeamComponent
        title="Why choose Ripple Media?"
        description="For the past 5 years, we have been creating content for businesses across the world. We have a proven track record of delivering high-quality content that drives results."
      />
    </div>
  );
};
