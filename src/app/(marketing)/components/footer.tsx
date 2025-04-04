import {LucideProps} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="w-full h-fit bg-[#34F4AF] relative  flex flex-col  items-center overflow-hidden">
      <div className="flex  w-full justify-between  md:px-16 relative py-4 overflow-hidden">
        <div className=" flex-col md:flex-row items-start md:items-center  relative hidden md:flex">
          {/* <Logo className="fill-[#141516] h-6 md:h-10 mb-1" /> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className=" h-8 md:h-14"
            fill="none"
            viewBox="0 0 1557 1554"
          >
            <g clipPath="url(#clip0_14_2)">
              <path
                fill="#141516"
                d="M1557 283.552v8.35c-9.33 7.279-15.59 11.655-25.1 1.429L1265.01 26.48c-11.88-8.172-6.97-23.399 6.88-23.845 19.96-.626 81.41 32.776 100.3 44.564 87.72 54.612 152.88 138.025 184.85 236.353z"
              ></path>
              <path
                fill="#34F4AF"
                d="M1278.99 1551.23v2.77h-13.89v-2.77c3.88-7.9 9.87-7.46 13.89 0"
              ></path>
              <path
                fill="#141516"
                d="M559.194 1240.22c-6.207 9.78 12.773 29.6 19.16 37.1 25.769 30.1 59.756 56.22 85.748 86.59 7.28 12.64 1.027 28.35-11.567 34.96-33.183 17.37-134.026 5.45-172.122-4.15-16.614-4.2-66.276-27.73-78.424-18.93-3.528 2.54-2.009 15.58-.178 19.73 5.314 11.93 40.864 34.39 51.493 45.77 19.338 20.72 25.412 56.8-9.691 60.02-27.958 2.59-75.923-12.59-103.077-22.33-130.453-46.66-237.415-159.64-273.01-294.13-5.359-20.23-18.98-73.28-4.912-89.49 30.816-35.59 79.808 49.74 100.397 60.73 8.709 4.64 18.713 4.82 20.544-6.74 1.652-10.5-19.919-69.66-23.67-87.39-8.084-37.96-12.907-82.164-9.647-120.924 2.233-26.792 9.066-59.122 43.723-46.574l100.932 99.221c50.645 20.947 10.63-48.405 4.154-68.097-30.191-91.764-27.109-194.512-.715-286.812 4.868-17.013 26.618-63.721 20.053-77.207-5.94-12.19-20.723.179-27.734 5.627-23.67 18.352-79.273 91.808-100.755 96.675-33.54 7.547-38.184-29.337-39.837-53.495-3.439-49.968 5.136-105.785 18.847-153.743 4.243-14.736 21.705-44.074 12.148-57.425-13.086-18.308-57.076 44.386-66.991 52.602-34.88 28.936-62.659 17.102-57.657-29.829C73.6 261.404 212.495 112.349 364.876 68.767c28.181-8.082 121.611-34.294 102.05 24.202-7.95 23.801-73.154 63.721-68.956 80.154 5.448 21.479 35.416 2.099 47.474-1.607 54.397-16.656 142.11-34.25 196.819-17.281 73.333 22.728-39.882 96.541-61.096 119.627-9.468 10.271-40.953 49.521-7.771 45.279 22.286-2.857 54.084-19.201 77.219-25.899 85.48-24.827 192.084-24.247 276.761 4.019 13.979 4.644 28.806 13.977 43.053 18.129 18.668 5.404 35.681 8.663 29.074-17.95l-101.96-103.731c-14.694-27.954 9.021-39.073 32.825-43.359 60.337-10.807 136.572 6.608 194.452 24.604 9.96 3.081 17.73 12.146 28.98 7.055 14.39-6.564 6.12-18.442-.4-27.283-17.5-23.622-64.98-42.511-61.9-77.385 2.73-30.722 38.46-24.247 59.76-20.541 161.67 28.087 343.39 195.227 352.91 364.331 2.14 37.777-17.29 63.587-52.84 36.169-15.58-12.011-42.34-52.245-55.6-58.407-8.53-3.974-16.75-.848-20.19 7.77-3.21 8.127 12.02 38.179 15.41 49.834 13.98 47.824 22.29 103.865 18.85 153.743-2.1 30.32-9.74 69.214-48.77 48.539l-100.44-99.712c-42.88-12.28-7.42 48.181-1.7 65.596 28.27 86.004 32.16 194.111 7.59 281.498-4.69 16.656-33.27 77.609-25.19 89.13 3.13 4.465 18 3.75 22.56 0l100.31-99.891c39.79-16.344 43.76 24.649 45.64 53.718 2.46 37.778-2.1 80.822-10.36 117.752-3.93 17.51-27.33 75.33-21.75 86.67 1.52 3.09 5.04 5.32 8.44 5.63 24.83 2.37 56.81-71.09 91.64-70.91 52.03.27 10.9 111.68.72 138.25-50.29 131.24-161.58 228.14-296.82 264.8-19.92 5.4-79.54 22.32-87.71-4.02-13.76-44.21 49.89-64.62 65.11-93.69 21.98-41.93-67.03-2.18-79.71.99-38.19 9.46-138.675 21.56-172.126 4.15-18.534-9.65-17.194-25.5-6.431-40.9l96.958-97.62c15.539-47.96-55.692-6.56-75.298-.27-86.329 27.78-198.561 26.53-285.113-.09-12.281-3.79-70.519-31.88-78.156-19.82zM13.086 1257.01c4.734-1.39 9.557-1.12 13.487 2.18 78.379 85.52 171.496 162.99 248.759 248.86 21.169 23.53 48.546 53.45-8.977 39.56-94.948-22.86-198.471-132.97-240.497-218.22-6.207-12.55-33.718-66.22-12.728-72.38zM282.925 3.349c10.227-1.384 23.223 4.287 18.087 15.272L27.868 293.33c-19.874 15.585-25.278-1.25-21.08-21.076 9.647-45.413 64.714-124.585 97.45-158.298C140.19 76.849 232.101 10.315 282.925 3.349M1278.99 1551.23c-4.47.58-9.38-.4-13.89 0-17.33-15.63 5.8-26.52 15.36-36.08 84.72-84.84 169.53-169.64 254.25-254.48 35.11-27.06 11.71 42.33 6.12 56.13-35.37 87.56-165.38 221.53-261.84 234.39z"
              ></path>
              <path
                fill="#34F4AF"
                d="M595.689 587.543c.177-46.958 51.121-76.115 91.699-52.483l326.282 190.026c40.58 23.632 40.36 82.329-.4 105.654L685.565 1018.3c-40.755 23.32-91.477-6.22-91.3-53.173z"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0_14_2">
                <path fill="#fff" d="M0 0h1557v1554H0z"></path>
              </clipPath>
            </defs>
          </svg>
          <h1 className="text-xl md:text-4xl text-[#141516] font1-bold ml-2">
            Ripple Media
          </h1>
        </div>
        <div className="flex gap-8 mx-auto md:mx-0 text-sm font1">
          <div className="flex w-fit gap-2 flex-col ">
            <h1 className="text-[#141516] font1-extra-bold">Ripple</h1>
            <Link
              href="/#about"
              className="text-[#141516] hover:text-white transition-all duration-300 capitalize"
            >
              about
            </Link>
            <Link
              href="/blog"
              className="text-[#141516] hover:text-white transition-all duration-300 capitalize"
            >
              Blog
            </Link>
            <Link
              href="/#stats"
              className="text-[#141516] hover:text-white transition-all duration-300 capitalize"
            >
              Work with us
            </Link>
          </div>
          <div className="flex w-fit gap-2 flex-col">
            <h1 className="text-[#141516] font1-extra-bold">Socials</h1>
            <Link
              href="https://www.instagram.com/whitespace__media/"
              className="text-[#141516] hover:text-white transition-all duration-300 capitalize"
            >
              Instagram
            </Link>
            <Link
              href="https://www.linkedin.com/in/whitespace-media-a464b8334/"
              className="text-[#141516] hover:text-white transition-all duration-300 capitalize"
            >
              LinkedIn
            </Link>
            <Link
              href="https://www.tiktok.com/@foundercentral"
              className="text-[#141516] hover:text-white transition-all duration-300 capitalize"
            >
              TikTok
            </Link>
          </div>
        </div>
        {/* <div className="absolute z-10  h-[100%]  md:left-0 bottom-0 -translate-x-1/3 md:-translate-x-0  "></div> */}
      </div>
      <span className="w-full border-t border-dashed border-[#141516] "></span>
      <div className="flex flex-row gap-4">
        <h1 className="text-[#141516] opacity-70 text-[12px] font1 my-2">
          © 2025 Ripple Media. All rights reserved.
        </h1>
        <Link
          href="/legal/privacy"
          className="text-[#141516] opacity-70 text-[12px] font1 my-2 hover:text-white"
        >
          Privacy Policy
        </Link>
        <Link
          href="/legal/terms"
          className="text-[#141516] opacity-70 text-[12px] font1 my-2 hover:text-white"
        >
          Terms
        </Link>
        <Link
          href="/legal/policy"
          className="text-[#141516] opacity-70 text-[12px] font1 my-2 hover:text-white"
        >
          Fulfillment Policy
        </Link>
      </div>
    </div>
  );
};

export default Footer;

function Logo({...props}: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      fill="none"
      viewBox="0 0 751 309"
    >
      <path d="M75.64.9c32.508 3.243 65.735 16.303 92.57 36.297 9.365 6.935 26.023 23.327 33.227 32.514 10.806 13.78 16.659 24.498 49.797 91.597 35.929 72.412 35.749 72.142 47.005 79.708 14.948 9.997 37.37 10.177 52.408.54 4.952-3.152 14.498-12.879 15.308-15.671.36-1.171-4.322-11.619-14.138-31.343a26565.335 26565.335 0 01-36.739-74.214c-12.067-24.498-30.346-61.335-40.522-81.96C264.291 17.833 256.096.721 256.276.45c.181-.27 16.569-.45 36.56-.27 38.721.18 44.484.63 64.925 5.404 36.469 8.376 71.498 30.172 96.801 60.254 14.228 16.842 15.849 19.905 70.598 130.865 14.047 28.551 15.668 31.343 20.981 37.017 9.725 10.268 20.351 14.771 34.668 14.861 16.479 0 31.157-7.295 39.982-19.994l2.431-3.513-15.308-30.983c-8.285-17.022-25.394-51.697-37.91-76.916C535.605 47.645 512.373.54 512.373.27c0-.09 53.669-.27 119.313-.27C697.331 0 751 .36 751 .72s-9.995 20.806-22.152 45.484c-12.246 24.678-27.735 56.201-34.578 70.071-62.403 127.172-64.475 130.865-83.565 149.689-49.526 48.906-129.399 57.101-189.191 19.364-13.867-8.826-33.137-26.749-41.422-38.728-2.161-3.062-4.052-5.584-4.142-5.584-.18 0-2.701 3.332-5.673 7.475-6.123 8.466-20.801 22.967-30.976 30.532-18.73 14.141-44.394 24.768-67.987 28.191-42.862 6.214-82.033-3.783-117.782-30.082-8.195-6.034-24.493-22.877-31.337-32.514-5.853-8.196-25.483-46.654-65.915-129.244-6.033-12.429-21.251-43.141-33.678-68.27C10.175 21.976 0 1.081 0 .63 0-.27 66.275 0 75.64.9z"></path>
      <path d="M75.64.9c32.508 3.243 65.735 16.303 92.57 36.297 9.365 6.935 26.023 23.327 33.227 32.514 10.806 13.78 16.659 24.498 49.797 91.597 35.929 72.412 35.749 72.142 47.005 79.708 14.948 9.997 37.37 10.177 52.408.54 4.952-3.152 14.498-12.879 15.308-15.671.36-1.171-4.322-11.619-14.138-31.343a26565.335 26565.335 0 01-36.739-74.214c-12.067-24.498-30.346-61.335-40.522-81.96C264.291 17.833 256.096.721 256.276.45c.181-.27 16.569-.45 36.56-.27 38.721.18 44.484.63 64.925 5.404 36.469 8.376 71.498 30.172 96.801 60.254 14.228 16.842 15.849 19.905 70.598 130.865 14.047 28.551 15.668 31.343 20.981 37.017 9.725 10.268 20.351 14.771 34.668 14.861 16.479 0 31.157-7.295 39.982-19.994l2.431-3.513-15.308-30.983c-8.285-17.022-25.394-51.697-37.91-76.916C535.605 47.645 512.373.54 512.373.27c0-.09 53.669-.27 119.313-.27C697.331 0 751 .36 751 .72s-9.995 20.806-22.152 45.484c-12.246 24.678-27.735 56.201-34.578 70.071-62.403 127.172-64.475 130.865-83.565 149.689-49.526 48.906-129.399 57.101-189.191 19.364-13.867-8.826-33.137-26.749-41.422-38.728-2.161-3.062-4.052-5.584-4.142-5.584-.18 0-2.701 3.332-5.673 7.475-6.123 8.466-20.801 22.967-30.976 30.532-18.73 14.141-44.394 24.768-67.987 28.191-42.862 6.214-82.033-3.783-117.782-30.082-8.195-6.034-24.493-22.877-31.337-32.514-5.853-8.196-25.483-46.654-65.915-129.244-6.033-12.429-21.251-43.141-33.678-68.27C10.175 21.976 0 1.081 0 .63 0-.27 66.275 0 75.64.9z"></path>
    </svg>
  );
}
