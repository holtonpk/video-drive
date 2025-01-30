// import "../../global-style.css";
import {SpeedInsights} from "@vercel/speed-insights/next";
export const metadata = {
  title: "Ripple Media",
  description: "Experts in short form",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <SpeedInsights />
      <body>{children}</body>
    </html>
  );
}
