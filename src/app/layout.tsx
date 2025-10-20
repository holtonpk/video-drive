// import "../../global-style.css";
import {SpeedInsights} from "@vercel/speed-insights/next";
import {Analytics} from "@vercel/analytics/react";
import {Toaster} from "@/components/ui/sonner";
export const metadata = {
  title: "Ripple Media",
  description: "Experts in short form",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <SpeedInsights />
      <Analytics />
      <Toaster />
      <body
        // className="dark"
        // style={{backgroundColor: "#121212"}}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
