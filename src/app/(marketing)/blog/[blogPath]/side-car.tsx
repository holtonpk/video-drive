"use client";
import React, {useEffect} from "react";

const SideCar = ({headingsList}: {headingsList: any[]}) => {
  const [isSticky, setSticky] = React.useState(false);
  const [width, setWidth] = React.useState(0);
  const carRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      const blogContainer = document.getElementById("blog");
      if (blogContainer) {
        const rect = blogContainer.getBoundingClientRect();
        // Check if the top of the blog container is at or above the viewport
        rect.top > 20 && carRef.current && setWidth(carRef.current.offsetWidth);
        setSticky(rect.top <= 20);
      }
    };

    // Add the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  console.log("isSticky", isSticky);

  return (
    <div
      ref={carRef}
      style={{
        width: isSticky ? width : "auto",
        position: isSticky ? "fixed" : "relative",
        top: "20px",
        right: isSticky ? "32px" : "0",
      }}
      className={" flex flex-col h-fit p-4 gap-8 rounded-sm bg-muted/50"}
    >
      <div className="flex flex-col gap-2">
        <h1 className="font1-bold text-xl">Table of contents</h1>
        <div className="flex gap-2 flex-col">
          {headingsList.map((section: any) => (
            <a
              href={`#${section.id}`}
              key={section.id}
              className="text-primary hover:underline"
            >
              - {section.text}
            </a>
          ))}
        </div>
      </div>
      <div className="w-full p-4 bg-background rounded-sm text-center items-center gap-2">
        <h1 className="text-xl font1-bold">
          Ready to transform your marketing?
        </h1>
        <p className="text-sm text-muted-foreground">
          lets get in touch and discuss how we can help you
        </p>
        <button className="mt-3 w-full px-4 bg-[#34F4AF] text-background font1-bold rounded-md py-2">
          Apply now
        </button>
        {/* <div className="w-full relative mt-2">
        <Input
          type="email"
          placeholder="Email address"
          className="w-full rounded-md p-2"
        />
        <button className="absolute right-0 top-0 h-full px-4 bg-[#34F4AF] text-background font1-bold rounded-r-md">
          Subscribe
        </button>
      </div> */}
      </div>
    </div>
  );
};

export default SideCar;
