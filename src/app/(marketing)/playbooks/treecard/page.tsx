import Image from "next/image";
import {
  Lightbulb,
  Brain,
  Goal,
  Users,
  Eye,
  Camera,
  Gem,
  LucideProps,
  Target,
} from "lucide-react";
import {Phone} from "lucide-react";
import Link from "next/link";
import {constructMetadata} from "@/lib/utils";
import {SeriesIdeas} from "./series-ideas";
import InstagramData from "./instagram/instagram";
import TiktokData from "./tiktok/tiktok";
import SocialAudit from "./social-audit";
export const metadata = constructMetadata({
  title: "Treecard Playbook",
  description: "A playbook for Treecard",
});

const Page = () => {
  return (
    <div className="flex flex-col items-center px-4 bg-white w-screen  mdscontainer mx-auto gap-8 py-6">
      {/* <Link
        href="https://calendly.com/holtonpk/30min"
        target="_blank"
        className="fixed bottom-4 right-4 bg-[#233461] text-[#0f1115] px-4 py-2 rounded-md flex items-center z-[999]"
      >
        <Phone className="w-4 h-4 mr-2" />
        Let&apos;s chat
      </Link> */}
      <div className="flex flex-col items-center gap-2">
        <div className="h-16 w-16 bg-white border flex items-center justify-center  rounded-md overflow-hidden shadow-md">
          <Image src="/treecard/logo.png" alt="Mozi" width={100} height={100} />
        </div>
        <h1 className="text-4xl font-bold text-center text-black">
          Treecard Playbook
        </h1>
        <p className="max-w-[500px] text-center  text-[#00AE70]">
          We&apos;ve developed this playbook to help continue your media growth.
        </p>
      </div>
      <SocialAudit />
    </div>
  );
};

export default Page;

const Arrow1 = ({...props}: LucideProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill="none"
      viewBox="0 0 243 236"
    >
      <g clipPath="url(#clip0_374_487)" opacity="1">
        <path d="M31.972 206.562a8.429 8.429 0 01-.394-5.722 108.646 108.646 0 013.266-11.07 157.197 157.197 0 019.542-22.703 4.055 4.055 0 014.174-.807 4.058 4.058 0 012.597 3.367 70.57 70.57 0 01-3.797 11.701c-1.544 3.968-4.196 12.443-5.712 17.49l.217-.073c.541-.252 2.354-.84 3.258-1.124 6.653-2.966 13.039-6.5 19.502-9.854 38.41-19.981 70.033-40.642 101.374-69.707a236.058 236.058 0 004.413-4.106c-10.331 4.164-20.604 8.471-30.898 12.726-3.203 1.318-6.416 2.617-9.682 3.774a10.333 10.333 0 01-6.422.858c-10.307-4.285 3.778-16.066 6.811-21.427a338.92 338.92 0 0030.713-45.62 172.783 172.783 0 0018.512-58.507 4.182 4.182 0 015.864-3.665c4.28 1.945 1.737 7.315 1.559 10.907a157.428 157.428 0 01-7.547 29.994 196.402 196.402 0 01-26.483 50.795c-6.354 9.186-13.439 17.86-20.026 26.874 12.878-4.734 29.048-12.39 43.096-17.263 3.567-1.481 10.117-2.764 10.105 2.923-.77 4.173-4.725 6.988-7.272 10.177a417.839 417.839 0 01-106.097 76.514c-6.66 3.766-17.99 8.999-23.075 11.073a234.315 234.315 0 0028.302 4.005 4.022 4.022 0 013.674 3.035 4.034 4.034 0 01-5.055 4.856c-10.76-.898-21.47-2.344-32.1-4.236a56.549 56.549 0 01-7.732-1.672 7.889 7.889 0 01-4.687-3.513zm97.868-76.111l-.008.003-.02.007.028-.01zm.172-.064c.73-.268.882-.332 0 0zm0 0l-.172.064.051-.018.121-.046z"></path>
      </g>
      <defs>
        <clipPath id="clip0_374_487">
          <path
            d="M0 0H252.316V85.835H0z"
            transform="rotate(136.764 108.918 79.34)"
          ></path>
        </clipPath>
      </defs>
    </svg>
  );
};
