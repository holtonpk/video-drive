import Link from "next/link";
import {NavBar} from "../navbar";
import localFont from "next/font/local";

const h1Font = localFont({
  src: "../fonts/HeadingNowTrial-56Bold.ttf",
});

const bodyFont = localFont({
  src: "../fonts/proximanova_light.otf",
});

export const ServiceHero = ({
  label,
  heading,
  body,
  color,
  children,
}: {
  label: string;
  heading: string;
  body: string;
  color: string;
  children: React.ReactNode;
}) => {
  return (
    <div className=" text-primary" style={{background: color}}>
      <NavBar bgColor={color} />
      <div className="container grid md:grid-cols-2 gap-10 py-16 md:min-h-screen">
        <div className="flex flex-col gap-4">
          <div
            className={`p-2  bg-white rounded-[8px] w-fit text-3xl -rotate-6 ${h1Font.className}`}
          >
            {label}
          </div>
          <h1 className={`text-8xl font-bold  ${h1Font.className}`}>
            {heading}
          </h1>
          <p className={`text-lg  text-primary/70 ${bodyFont.className}`}>
            {body}
          </p>
          <Link
            href="/contact"
            className={`w-fit flex gap-4 items-center bg-primary text-background hover:ring-2 hover:ring-primary ring-offset-4  py-2 px-6 rounded-full  text-2xl ${h1Font.className}`}
            style={
              color
                ? ({"--tw-ring-offset-color": color} as React.CSSProperties)
                : undefined
            }
          >
            <div className="flex">
              <div className="p-[2px] rounded-full bg-white relative h-10 w-10 -ml-2">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/IMG_0878.jpg?alt=media&token=0b2bed83-d3ca-47c3-9c43-1a7a0158a1f2"
                  alt="profile"
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
              <div className="p-[2px] rounded-full bg-white relative h-10 w-10 -ml-2">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/profile.png?alt=media&token=a973ee0a-ff42-43a5-86e1-d52325696d14"
                  alt="profile"
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
              <div className="p-[2px] rounded-full bg-white relative h-10 w-10 -ml-2">
                <img
                  src="https://lh3.googleusercontent.com/a/ACg8ocKrWZ-yNhXDVCODwyNgxuqmB7vjv523Cx-55i1yMnuGLjKGUDHI=s96-c"
                  alt="profile"
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
            </div>
            Let&apos;s talk
          </Link>
        </div>
        <div className="hidden md:flex">{children}</div>
      </div>
    </div>
  );
};
