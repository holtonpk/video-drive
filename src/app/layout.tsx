// import "../../global-style.css";

export const metadata = {
  title: "Ripple Media",
  description: "Experts in short form",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
