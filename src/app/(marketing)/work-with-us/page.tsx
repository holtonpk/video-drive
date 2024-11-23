import Background from "@/src/app/(marketing)/components/background";
import Navbar from "@/src/app/(marketing)/components/navbar";
import Footer from "@/src/app/(marketing)/components/footer";
import {constructMetadata} from "@/lib/utils";
import ContactForm from "@/src/app/(marketing)/work-with-us/form";

export const metadata = constructMetadata({
  title: "Work With Us",
  description: "Join our team",
});
const HomePage = () => {
  return (
    <>
      {/* <LoadingScreen /> */}
      <div className="dark flex flex-col h-fit min-h-screen">
        <Background />
        <div className="   min-w-screen   flex flex-col  overflow-hidden">
          <Navbar show={true} />
          <ContactForm />
        </div>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default HomePage;
