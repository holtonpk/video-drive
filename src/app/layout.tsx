// import "../../global-style.css";
import {SpeedInsights} from "@vercel/speed-insights/next";
import {Analytics} from "@vercel/analytics/react";
export const metadata = {
  title: "Ripple Media",
  description: "Experts in short form",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <SpeedInsights />
      <Analytics />
      <body>{children}</body>
    </html>
  );
}
