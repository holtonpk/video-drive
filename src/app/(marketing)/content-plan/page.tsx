import Background from "@/src/app/(marketing)/components/background";
import Navbar from "@/src/app/(marketing)/components/navbar";
import Footer from "@/src/app/(marketing)/components/footer";
import {constructMetadata} from "@/lib/utils";
import {ContentPlanForm} from "./content-plan";

export const metadata = constructMetadata({
  title: "Free Content Plan",
  description: "Get a free custom content plan for your business",
});

const Page = () => {
  return (
    <>
      {/* <LoadingScreen /> */}
      <div className="dark flex flex-col h-fit min-h-screen">
        <Background />
        <div className="   min-w-screen   flex flex-col  overflow-hidden">
          <Navbar show={true} />
          <ContentPlanForm />
        </div>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Page;
