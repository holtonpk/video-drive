import React from "react";

import policyConfig from "./policyConfig.json";
import {NavBar} from "../../navbar";
import {Footer} from "../../footer";

import {LucideProps} from "lucide-react";

const PolicyPage = () => {
  return (
    <div className="dark flex flex-col h-fit min-h-screen">
      <NavBar />
      <PolicyBody />
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

const PolicyBody = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Policies & Terms</h1>

      {/* Refund Policy Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          What We&apos;re Selling:
        </h2>
        <p>
          Ripple Media is a digital marketing agency that helps businesses grow
          their online presence through high-performing short-form video
          content. We specialize in organic content strategies across TikTok,
          Instagram Reels, and YouTube Shorts—designed to drive attention,
          clicks, and measurable attribution. We create custom short-form video
          packages tailored to each client&apos;s goals. Our services include:
          <ul className="list-disc pl-6">
            <li>Content strategy and planning</li>
            <li>Video concept, scriptwriting and editing</li>
            <li>Professional video editing with trending formats</li>
            <li>Scheduling and posting assistance</li>
            <li>Monthly analytics and performance reports</li>
          </ul>
          We offer flexible, month-to-month packages based on the number of
          videos produced per month. Our goal is to help brands go viral through
          consistent, high-quality content—no ad spend required. You&apos;ll
          receive a dedicated content strategy, transparent communication, and a
          reliable team focused on helping your brand gain traction online.
        </p>
        <h2 className="text-2xl font-semibold mb-4 mt-4">
          The Purchase Currency:
        </h2>
        <p className="mb-4">
          All prices listed on our website are in United States Dollars (USD).
          This currency will be used for all transactions, invoices, and
          payments unless otherwise agreed upon in writing. Please ensure
          you&apos;re aware of any potential conversion fees if purchasing from
          outside the U.S.
        </p>
      </section>

      {/* Shipping Policy Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Customer Service Contact Information:
        </h2>
        <p className="mb-4">
          We&apos;re here to help! For questions, support, or inquiries, you can
          reach us through the following channels:
          <ul className="list-disc pl-6">
            <li>Email: team@ripplemedia.co</li>
            <li>Phone: (651) 443-8016 </li>
            <li>
              Live Chat: Available on our website Monday–Friday, 9am–5pm CST
            </li>
          </ul>
          We aim to respond to all messages within 24 hours during business
          days. Whether you&apos;re a current client or just curious about our
          services, don&apos;t hesitate to get in touch—we&apos;re happy to
          chat.
        </p>
      </section>

      {/* Privacy Policy Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Fulfillment Policies</h2>

        <p className="mb-4">
          Ripple Media provides digital marketing services, including strategy
          development, content creation, and performance reporting. As a
          service-based business, our fulfillment process is based on timely
          delivery, collaboration, and transparent communication.
        </p>

        <h3 className="text-xl font-semibold mb-2">Refund Policy</h3>
        <p className="mb-4">
          Due to the time-intensive and customized nature of our work, we do not
          offer refunds once content creation has begun. However, if a
          deliverable does not meet the agreed-upon scope, we will revise the
          work to ensure it aligns with client expectations.
        </p>

        <h3 className="text-xl font-semibold mb-2">Delivery Policy</h3>
        <p className="mb-4">
          All content is delivered digitally via Google Drive, Dropbox, or a
          preferred project management platform. Turnaround times are
          established during onboarding, generally ranging from 7–10 business
          days for the first round of deliverables. Any revised timelines will
          be communicated promptly.
        </p>

        <h3 className="text-xl font-semibold mb-2">Return Policy</h3>
        <p className="mb-4">
          As our services are digital and customized, there are no returns.
          However, we&apos;re committed to delivering content you&apos;re happy
          with, and we&apos;ll work with you to make necessary revisions based
          on our original agreement.
        </p>

        <h3 className="text-xl font-semibold mb-2">
          Cancellation & Termination Policy
        </h3>
        <p className="mb-4">
          Clients may cancel their month-to-month subscription at any time with
          15 days&apos; written notice prior to the next billing cycle. Work
          already completed or in progress will be delivered, and no further
          billing will occur following the cancellation date.
        </p>
        <p className="mb-4">
          Additionally, the Client may terminate the agreement with 15
          days&apos; written notice if Ripple Media breaches any material term
          or condition of the agreement and fails to resolve the issue within 7
          days of receiving written notice of the breach.
        </p>

        <p className="italic mt-6">
          If you have questions or would like to discuss any of these policies,
          feel free to contact us at{" "}
          <a
            href="mailto:team@ripplemedia.co"
            className="text-blue-600 hover:underline"
          >
            team@ripplemedia.co
          </a>
          .
        </p>
      </section>

      {/* Legal/Export Restrictions Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Legal or Export Restrictions
        </h2>
        <p className="mb-4">
          Ripple Media does not currently offer any physical goods or
          internationally restricted services. Our digital marketing services
          are provided remotely and are not subject to export control
          regulations. If any legal or jurisdictional restrictions arise that
          may impact our ability to provide services, we will notify affected
          clients immediately and work to find an appropriate solution.
        </p>
      </section>

      {/* Privacy Policy Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
        <p className="mb-4">
          We respect your privacy and are committed to protecting your personal
          information. Ripple Media collects only the data necessary to provide
          and improve our services—such as your name, email, and payment
          details. We do not sell, rent, or share your data with third parties
          without your consent, except when required by law.
        </p>
        <p className="mb-4">
          Data is stored securely, and we use trusted platforms with robust
          security protocols. You can request to review, update, or delete your
          personal data at any time by contacting us at team@ripplemedia.co.
        </p>
        <p className="mb-4">
          <a href="/legal/privacy" className="text-blue-600 hover:underline">
            View our full Privacy Policy
          </a>{" "}
          for more details.
        </p>
      </section>

      {/* Business Address Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Business Address</h2>
        <p className="mb-4">
          Ripple Media
          <br />
          2808 Silver Lane, Saint Anthony, MN, 55421
          <br />
          United States
        </p>
        <p className="italic mb-4">
          Please note: We are a remote-first agency and do not accept walk-ins
          at this location.
        </p>
      </section>

      {/* Promotions Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Terms of Promotions</h2>
        <p className="mb-4">
          From time to time, Ripple Media may offer promotional discounts, free
          trials, or limited-time packages. All promotional offers will clearly
          state:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>The duration of the offer</li>
          <li>Eligibility criteria</li>
          <li>What is included or excluded</li>
          <li>Any applicable limitations (e.g., new clients only)</li>
        </ul>
        <p className="mb-4">
          Unless otherwise stated, promotions cannot be combined and are valid
          for one use per client. All promotional terms will be clearly
          displayed at the time of the offer.
        </p>
      </section>

      {/* Security Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Website & Payment Security
        </h2>
        <p className="mb-4">
          Your security is important to us. Ripple Media&apos;s website uses
          HTTPS encryption and complies with PCI DSS standards to ensure your
          payment and personal information is handled securely.
        </p>
        <p className="mb-4">
          We partner with Stripe to process all payments, so your card details
          are never stored on our servers. Stripe&apos;s secure infrastructure
          helps us safeguard your data against unauthorized access and fraud.
        </p>
      </section>

      {/* Payment Methods Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Accepted Payment Methods
        </h2>
        <p className="mb-4">
          We currently accept the following major credit cards:
        </p>
        <ul className="flex gap-2 mb-4">
          <VisaIcon className="w-10 h-10" />
          <AmericanExpressIcon className="w-10 h-10" />
          <MastercardIcon className="w-10 h-10" />
          <DiscoverIcon className="w-10 h-10" />
        </ul>
        <p className="mb-4">
          You&apos;ll see accepted payment methods at checkout and on your
          invoice.
        </p>
      </section>
    </div>
  );
};

export default PolicyPage;

const DiscoverIcon = ({...props}: LucideProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 780 500">
    <g fillRule="evenodd">
      <path
        fill="#4D4D4D"
        d="M54.992 0C24.627 0 0 24.63 0 55.004v390.992C0 476.376 24.619 501 54.992 501h670.016C755.373 501 780 476.37 780 445.996V55.004C780 24.624 755.381 0 725.008 0z"
      ></path>
      <path
        fill="#FFF"
        d="M327.152 161.893c8.837 0 16.248 1.784 25.268 6.09v22.751c-8.544-7.863-15.955-11.154-25.756-11.154-19.264 0-34.414 15.015-34.414 34.05 0 20.075 14.681 34.196 35.37 34.196 9.312 0 16.586-3.12 24.8-10.857v22.763c-9.341 4.14-16.911 5.776-25.756 5.776-31.278 0-55.582-22.596-55.582-51.737 0-28.826 24.951-51.878 56.07-51.878m-97.113.627c11.546 0 22.11 3.72 30.943 10.994l-10.748 13.248c-5.35-5.646-10.41-8.028-16.564-8.028-8.853 0-15.3 4.745-15.3 10.989 0 5.354 3.619 8.188 15.944 12.482 23.365 8.044 30.29 15.176 30.29 30.926 0 19.193-14.976 32.553-36.32 32.553-15.63 0-26.994-5.795-36.458-18.872l13.268-12.03c4.73 8.61 12.622 13.222 22.42 13.222 9.163 0 15.947-5.952 15.947-13.984 0-4.164-2.055-7.734-6.158-10.258-2.066-1.195-6.158-2.977-14.2-5.647-19.291-6.538-25.91-13.527-25.91-27.185 0-16.225 14.214-28.41 32.846-28.41m234.723 1.728h22.437l28.084 66.592 28.446-66.592h22.267l-45.494 101.686h-11.053zm-397.348.152h30.15c33.312 0 56.534 20.382 56.534 49.641 0 14.59-7.104 28.696-19.118 38.057-10.108 7.901-21.626 11.445-37.574 11.445H67.414zm96.135 0h20.54v99.143h-20.54zm411.734 0h58.252v16.8H595.81v22.005h36.336v16.791H595.81v26.762h37.726v16.785h-58.252zm71.858 0h30.455c23.69 0 37.265 10.71 37.265 29.272 0 15.18-8.514 25.14-23.986 28.105l33.148 41.766h-25.26l-28.429-39.828h-2.678v39.828h-20.515zm20.515 15.616v30.025h6.002c13.117 0 20.069-5.362 20.069-15.328 0-9.648-6.954-14.697-19.745-14.697zM87.94 181.199v65.559h5.512c13.273 0 21.656-2.394 28.11-7.88 7.103-5.955 11.376-15.465 11.376-24.98 0-9.499-4.273-18.725-11.376-24.681-6.785-5.78-14.837-8.018-28.11-8.018z"
      ></path>
      <path
        fill="#F47216"
        d="M415.13 161.21c30.941 0 56.022 23.58 56.022 52.709v.033c0 29.13-25.081 52.742-56.021 52.742s-56.022-23.613-56.022-52.742v-.033c0-29.13 25.082-52.71 56.022-52.71zm364.85 127.15C753.93 306.69 558.9 437.7 221.23 500.98h503.76c30.365 0 54.992-24.63 54.992-55.004v-157.62z"
      ></path>
    </g>
  </svg>
);

const MastercardIcon = ({...props}: LucideProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 780 500">
    <g clipPath="url(#clip0_6278_125843)">
      <path
        fill="#253747"
        d="M40 0h700c22.092 0 40 17.909 40 40v420c0 22.092-17.908 40-40 40H40c-22.091 0-40-17.908-40-40V40C0 17.909 17.909 0 40 0"
      ></path>
      <path
        fill="#fff"
        d="M211.053 467.045v-28.936c0-11.068-6.742-18.316-18.317-18.316-5.787 0-12.079 1.91-16.406 8.203-3.371-5.281-8.203-8.203-15.451-8.203-4.832 0-9.664 1.461-13.484 6.742v-5.787h-10.114v46.297h10.114v-25.564c0-8.203 4.326-12.08 11.068-12.08s10.114 4.326 10.114 12.08v25.564h10.113v-25.564c0-8.203 4.832-12.08 11.069-12.08 6.742 0 10.113 4.326 10.113 12.08v25.564zm150.015-46.297h-16.406v-13.99h-10.113v13.99h-9.158v9.158h9.158v21.239c0 10.619 4.326 16.855 15.9 16.855 4.327 0 9.159-1.461 12.53-3.371l-2.922-8.709c-2.922 1.911-6.293 2.416-8.709 2.416-4.832 0-6.742-2.921-6.742-7.697v-20.733h16.406v-9.158zm85.852-1.011c-5.787 0-9.664 2.921-12.08 6.742v-5.787h-10.113v46.297h10.113v-26.07c0-7.698 3.371-12.08 9.664-12.08 1.91 0 4.326.506 6.293.955l2.921-9.664c-2.022-.393-4.888-.393-6.798-.393m-129.733 4.832c-4.831-3.371-11.574-4.832-18.822-4.832-11.574 0-19.271 5.787-19.271 14.945 0 7.698 5.787 12.08 15.9 13.485l4.832.505c5.282.956 8.203 2.416 8.203 4.832 0 3.371-3.877 5.787-10.619 5.787s-12.08-2.416-15.451-4.832l-4.832 7.698c5.282 3.877 12.53 5.787 19.777 5.787 13.485 0 21.239-6.293 21.239-14.945 0-8.203-6.293-12.53-15.901-13.991l-4.832-.505c-4.326-.506-7.697-1.461-7.697-4.327 0-3.371 3.371-5.281 8.708-5.281 5.788 0 11.575 2.416 14.496 3.877zm269.073-4.832c-5.787 0-9.664 2.921-12.08 6.742v-5.787h-10.113v46.297h10.113v-26.07c0-7.698 3.371-12.08 9.664-12.08 1.91 0 4.326.506 6.293.955l2.922-9.552c-1.967-.505-4.832-.505-6.799-.505m-129.227 24.16c0 13.99 9.664 24.103 24.61 24.103 6.742 0 11.574-1.461 16.406-5.281l-4.832-8.203c-3.877 2.921-7.698 4.326-12.08 4.326-8.203 0-13.99-5.787-13.99-14.945 0-8.709 5.787-14.496 13.99-14.946 4.326 0 8.203 1.461 12.08 4.327l4.832-8.204c-4.832-3.876-9.664-5.281-16.406-5.281-14.946-.056-24.61 10.113-24.61 24.104m93.549 0v-23.149h-10.113v5.787c-3.371-4.326-8.203-6.742-14.496-6.742-13.035 0-23.148 10.113-23.148 24.104S512.938 468 525.973 468c6.742 0 11.574-2.416 14.496-6.742v5.787h10.113zm-37.138 0c0-8.204 5.281-14.946 13.99-14.946 8.203 0 13.99 6.293 13.99 14.946 0 8.203-5.787 14.945-13.99 14.945-8.653-.506-13.99-6.799-13.99-14.945m-121.024-24.16c-13.485 0-23.149 9.664-23.149 24.103 0 14.496 9.664 24.104 23.655 24.104 6.742 0 13.484-1.91 18.822-6.293l-4.832-7.248c-3.877 2.922-8.709 4.832-13.485 4.832-6.292 0-12.529-2.921-13.99-11.068h34.217v-3.877c.45-14.889-8.259-24.553-21.238-24.553m0 8.709c6.293 0 10.619 3.876 11.574 11.068h-24.103c.955-6.236 5.281-11.068 12.529-11.068m251.262 15.451v-41.465h-10.114v24.103c-3.371-4.326-8.203-6.742-14.495-6.742-13.036 0-23.149 10.113-23.149 24.104S606.037 468 619.073 468c6.742 0 11.574-2.416 14.495-6.742v5.787h10.114zm-37.139 0c0-8.204 5.282-14.946 13.99-14.946 8.203 0 13.991 6.293 13.991 14.946 0 8.203-5.788 14.945-13.991 14.945-8.708-.506-13.99-6.799-13.99-14.945m-338.574 0v-23.149h-10.114v5.787c-3.371-4.326-8.203-6.742-14.495-6.742-13.035 0-23.149 10.113-23.149 24.104S230.325 468 243.36 468c6.742 0 11.574-2.416 14.495-6.742v5.787h10.114zm-37.588 0c0-8.204 5.281-14.946 13.99-14.946 8.203 0 13.99 6.293 13.99 14.946 0 8.203-5.787 14.945-13.99 14.945-8.709-.506-13.99-6.799-13.99-14.945"
      ></path>
      <path fill="#FF5A00" d="M465.738 69.139H313.812v272.949h151.926z"></path>
      <path
        fill="#EB001B"
        d="M323.926 205.613c0-55.455 26.07-104.673 66.074-136.474C360.559 45.99 323.42 32 282.91 32c-95.965 0-173.613 77.648-173.613 173.613s77.648 173.614 173.613 173.614c40.51 0 77.649-13.99 107.09-37.139-40.06-31.351-66.074-81.019-66.074-136.475"
      ></path>
      <path
        fill="#F79E1B"
        d="M670.711 205.613c0 95.965-77.649 173.614-173.613 173.614-40.51 0-77.649-13.99-107.09-37.139 40.51-31.857 66.074-81.019 66.074-136.475s-26.07-104.673-66.074-136.474C419.393 45.99 456.532 32 497.041 32c96.021 0 173.67 78.154 173.67 173.613"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_6278_125843">
        <path fill="#fff" d="M0 0h780v500H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

const AmericanExpressIcon = ({...props}: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 780 500"
    {...props}
  >
    <path
      fill="#2557D6"
      d="M40 .001h700c22.092 0 40 17.909 40 40v420c0 22.092-17.908 40-40 40H40c-22.091 0-40-17.908-40-40v-420c0-22.091 17.909-40 40-40"
    ></path>
    <path
      fill="#fff"
      d="M.253 235.69h37.441l8.442-19.51h18.9l8.42 19.51h73.668v-14.915l6.576 14.98h38.243l6.576-15.202v15.138h183.08l-.085-32.026h3.542c2.479.083 3.204.302 3.204 4.226v27.8h94.689v-7.455c7.639 3.92 19.518 7.455 35.148 7.455h39.836l8.525-19.51h18.9l8.337 19.51h76.765v-18.532l11.626 18.532h61.515v-122.51h-60.88v14.468l-8.522-14.468h-62.471v14.468l-7.828-14.468h-84.38c-14.123 0-26.539 1.889-36.569 7.153v-7.153h-58.229v7.153c-6.383-5.426-15.079-7.153-24.75-7.153h-212.74l-14.274 31.641-14.659-31.641H91.294v14.468l-7.362-14.468H26.787L.248 171.427v64.261h.003zm236.34-17.67h-22.464l-.083-68.794-31.775 68.793h-19.24l-31.858-68.854v68.854h-44.57l-8.42-19.592H32.556l-8.505 19.592H.25l39.241-87.837H72.05l37.269 83.164v-83.164h35.766l28.678 59.587 26.344-59.587h36.485zm-165.9-37.823L55.695 145.18 40.78 180.197zm255.3 37.821H252.79v-87.837h73.203v18.291h-51.289v15.833h50.06v18.005h-50.061v17.542h51.289zm103.16-64.18c0 14.004-9.755 21.24-15.439 23.412 4.794 1.748 8.891 4.838 10.84 7.397 3.094 4.369 3.628 8.271 3.628 16.116v17.255h-22.104l-.083-11.077c0-5.285.528-12.886-3.458-17.112-3.202-3.09-8.083-3.76-15.973-3.76h-23.523v31.95h-21.914v-87.838h50.401c11.199 0 19.451.283 26.535 4.207 6.933 3.924 11.09 9.652 11.09 19.45m-27.699 13.042c-3.013 1.752-6.573 1.81-10.841 1.81h-26.62v-19.51h26.982c3.818 0 7.804.164 10.393 1.584 2.842 1.28 4.601 4.003 4.601 7.765 0 3.84-1.674 6.929-4.515 8.351m62.844 51.138H441.94v-87.837h22.358zm259.56 0h-31.053l-41.535-65.927v65.927h-44.628l-8.527-19.592h-45.521l-8.271 19.592h-25.648c-10.649 0-24.138-2.257-31.773-9.715-7.701-7.458-11.708-17.56-11.708-33.533 0-13.027 2.395-24.936 11.812-34.347 7.085-7.01 18.18-10.242 33.28-10.242h21.215v18.821H520.73c-7.997 0-12.514 1.14-16.862 5.203-3.735 3.699-6.298 10.69-6.298 19.897 0 9.41 1.951 16.196 6.023 20.628 3.373 3.476 9.506 4.53 15.272 4.53h9.842l30.884-69.076h32.835l37.102 83.081v-83.08h33.366l38.519 61.174v-61.174h22.445zm-133.2-37.82-15.165-35.017-15.081 35.017zm189.04 178.08c-5.322 7.457-15.694 11.238-29.736 11.238h-42.319v-18.84h42.147c4.181 0 7.106-.527 8.868-2.175 1.665-1.474 2.605-3.554 2.591-5.729 0-2.561-1.064-4.593-2.677-5.811-1.59-1.342-3.904-1.95-7.722-1.95-20.574-.67-46.244.608-46.244-27.194 0-12.742 8.443-26.156 31.439-26.156h43.649v-17.479h-40.557c-12.237 0-21.129 2.81-27.425 7.174v-7.175h-59.985c-9.595 0-20.854 2.279-26.179 7.175v-7.175h-107.12v7.175c-8.524-5.892-22.908-7.175-29.549-7.175h-70.656v7.175c-6.745-6.258-21.742-7.175-30.886-7.175H308.26l-18.094 18.764-16.949-18.764h-118.13v122.59h115.9l18.646-19.062 17.565 19.062 71.442.061v-28.838h7.021c9.479.14 20.66-.228 30.523-4.312v33.085h58.928v-31.952h2.842c3.628 0 3.985.144 3.985 3.615v28.333h179.01c11.364 0 23.244-2.786 29.824-7.845v7.845h56.78c11.815 0 23.354-1.587 32.134-5.649l.002-22.84zm-354.94-47.155c0 24.406-19.005 29.445-38.159 29.445h-27.343v29.469h-42.591l-26.984-29.086-28.042 29.086h-86.802v-87.859h88.135l26.961 28.799 27.875-28.799h70.021c17.389 0 36.929 4.613 36.929 28.945m-174.22 40.434H196.66v-17.48h48.11v-17.926h-48.11v-15.974h54.939l23.969 25.604zm86.81 10.06-33.644-35.789 33.644-34.65zm49.757-39.066h-28.318v-22.374h28.572c7.912 0 13.404 3.09 13.404 10.772 0 7.599-5.238 11.602-13.658 11.602m148.36-40.373h73.138v18.17h-51.315v15.973h50.062v17.926h-50.062v17.48l51.314.08v18.23h-73.139zm-28.119 47.029c4.878 1.725 8.865 4.816 10.734 7.375 3.095 4.291 3.542 8.294 3.631 16.037v17.418h-22.002v-10.992c0-5.286.531-13.112-3.542-17.198-3.201-3.147-8.083-3.899-16.076-3.899h-23.42v32.09h-22.02v-87.859h50.594c11.093 0 19.173.47 26.366 4.146 6.915 4.004 11.266 9.487 11.266 19.511-.001 14.022-9.764 21.178-15.531 23.371M494.961 318.1c-2.932 1.667-6.556 1.811-10.818 1.811h-26.622v-19.732h26.982c3.902 0 7.807.08 10.458 1.587 2.84 1.423 4.538 4.146 4.538 7.903 0 3.758-1.699 6.786-4.538 8.431m197.82 5.597c4.27 4.229 6.554 9.571 6.554 18.613 0 18.9-12.322 27.723-34.425 27.723h-42.68v-18.84h42.51c4.157 0 7.104-.525 8.95-2.175 1.508-1.358 2.589-3.333 2.589-5.729 0-2.561-1.17-4.592-2.675-5.811-1.675-1.34-3.986-1.949-7.803-1.949-20.493-.67-46.157.609-46.157-27.192 0-12.744 8.355-26.158 31.33-26.158h43.932v18.7h-40.198c-3.984 0-6.575.145-8.779 1.587-2.4 1.422-3.29 3.534-3.29 6.319 0 3.314 2.037 5.57 4.795 6.546 2.311.77 4.795.995 8.526.995l11.797.306c11.895.276 20.061 2.248 25.024 7.065m86.955-23.52h-39.938c-3.986 0-6.638.144-8.867 1.587-2.312 1.423-3.202 3.534-3.202 6.322 0 3.314 1.951 5.568 4.791 6.544 2.312.771 4.795.996 8.444.996l11.878.304c11.983.284 19.982 2.258 24.86 7.072.891.67 1.422 1.422 2.033 2.175z"
    ></path>
  </svg>
);

const VisaIcon = ({...props}: LucideProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    fill="none"
    viewBox="0 0 780 500"
  >
    <g clipPath="url(#clip0_6278_125851)">
      <path
        fill="#1434CB"
        d="M40 0h700c22.092 0 40 17.909 40 40v420c0 22.092-17.908 40-40 40H40c-22.091 0-40-17.908-40-40V40C0 17.909 17.909 0 40 0"
      ></path>
      <path
        fill="#fff"
        d="M489.823 143.111c-46.835 0-88.689 24.282-88.689 69.145 0 51.45 74.23 55.003 74.23 80.85 0 10.883-12.469 20.625-33.764 20.625-30.223 0-52.811-13.612-52.811-13.612l-9.666 45.272s26.022 11.498 60.569 11.498c51.206 0 91.498-25.474 91.498-71.105 0-54.365-74.538-57.813-74.538-81.803 0-8.526 10.235-17.867 31.47-17.867 23.959 0 43.506 9.9 43.506 9.9l9.459-43.725s-21.269-9.178-51.264-9.178m-428.494 3.3-1.134 6.6s19.704 3.607 37.45 10.803c22.85 8.25 24.477 13.054 28.326 27.972l41.934 161.7h56.213l86.601-207.075h-56.084l-55.646 140.791-22.707-119.341c-2.083-13.658-12.631-21.45-25.542-21.45zm271.942 0-43.996 207.075h53.481l43.842-207.075zm298.283 0c-12.896 0-19.729 6.907-24.743 18.975l-78.353 188.1h56.084l10.851-31.35h68.327l6.598 31.35h49.487l-43.172-207.075zm7.294 55.945 16.625 77.705h-44.538z"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_6278_125851">
        <path fill="#fff" d="M0 0h780v500H0z"></path>
      </clipPath>
    </defs>
  </svg>
);
