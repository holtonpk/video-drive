import {constructMetadata} from "@/lib/utils";
import Background from "@/src/app/(marketing)/components/background";
import {Metadata} from "next";
import Footer from "@/src/app/(marketing)/components/footer";
import Navbar from "@/src/app/(marketing)/components/navbar";
import CaseStudy from "./case-study";

export const generateMetadata = ({
  params,
}: {
  params: {clientId: string};
}): Metadata => {
  return {
    title: `Case Study - ${params.clientId}`,
    description: `How Ripple Media helped ${params.clientId} achieve their goals`,
    icons: {
      icon: "image/favicon.ico",
      shortcut: "image/favicon-16x16.png",
      apple: "image/apple-touch-icon.png",
    },
  };
};

const Page = ({params}: {params: {clientId: string}}) => {
  return (
    <>
      {/* <LoadingScreen /> */}
      <div className="dark ">
        <Background />
        <div className="min-h-screen   min-w-screen   flex flex-col  overflow-hidden">
          <Navbar show={true} isRelative />
          <CaseStudy clientId={params.clientId} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Page;
