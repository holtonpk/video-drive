import {Heart} from "../icons";
import localFont from "next/font/local";

const h1Font = localFont({
  src: "../fonts/HeadingNowTrial-56Bold.ttf",
});

const bodyFont = localFont({
  src: "../fonts/proximanova_light.otf",
});

const h2Font = localFont({
  src: "../fonts/HeadingNowTrial-55Medium.ttf",
});

const bodyBoldFont = localFont({
  src: "../fonts/proximanova_bold.otf",
});

export const Reviews = () => {
  const reviewsDesktop = [
    {
      stars: 5,
      body: "The Ripple team has helped us iterate to the point where our videos hit 1M+ views  on tiktok/reels/yt shorts and they have been awesome to work with through our ups and downs. These guys are the real deal.",
      name: "Andy Bauch",
      title: "CEO",
      company: "Morty App",
      image:
        "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/Untitled_(1).png?alt=media&token=dfb5a13b-9296-4724-9f7f-cb1da2fc7bc6",
    },

    {
      stars: 5,
      body: "We were struggling to find our brand voice on TikTok until Ripple stepped in. Their team doesn’t just deliver content — they help you understand what resonates and why. The difference in engagement has been night and day.",
      name: "Priya Khanna",
      title: "Co-Founder",
      company: "GlowHaus",
      image: "https://via.placeholder.com/150",
    },
    {
      stars: 5,
      body: "The Ripple team is absolutely dialed. They are a pleasure to work with and have delivered on every promise.",
      name: "Jason Yeager",
      title: "Investor | Founder",
      company: "MyTechCEO",
      image:
        "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/1710884757474.jpeg?alt=media&token=82267a64-c93d-45e8-9330-aeb79b7feff9",
    },

    {
      stars: 5,
      body: "Ripple didn’t just help us grow, they helped us *own* our niche. Their creative instincts and ability to execute quickly made a huge difference in how we show up on social media.",
      name: "Leo Tanaka",
      title: "CEO",
      company: "SnapBuild",
      image: "https://via.placeholder.com/150",
    },

    {
      stars: 5,
      body: "These guys know shortform video like the back of their hand. From organic TOF content to paid ads, they've got it all covered. They are very professional and always deliver on time. The reports have been very useful.",
      name: "Matt Heytens",
      title: "Growth Lead",
      company: "Blaze AI",
      image:
        "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/1692796692924.jpeg?alt=media&token=093521dc-0ec1-4a6b-a24b-be6c723c1c78",
    },

    {
      stars: 5,
      body: "We worked with Ripple on a few launches and were blown away each time. From scripting to visuals to strategy, they just get it. Our followers keep asking who makes our videos — it’s them.",
      name: "Alisha Verma",
      title: "CEO",
      company: "Freshly Rooted",
      image: "https://via.placeholder.com/150",
    },
  ];

  const reviewsMobile = [
    {
      stars: 5,
      body: "The Ripple team has helped us iterate to the point where our videos hit 1M+ views  on tiktok/reels/yt shorts and they have been awesome to work with through our ups and downs. These guys are the real deal.",
      name: "Andy Bauch",
      title: "CEO",
      company: "Morty App",
      image:
        "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/Untitled_(1).png?alt=media&token=dfb5a13b-9296-4724-9f7f-cb1da2fc7bc6",
    },

    {
      stars: 5,
      body: "The Ripple team is absolutely dialed. They are a pleasure to work with and have delivered on every promise.",
      name: "Jason Yeager",
      title: "Investor | Founder",
      company: "MyTechCEO",
      image:
        "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/1710884757474.jpeg?alt=media&token=82267a64-c93d-45e8-9330-aeb79b7feff9",
    },

    {
      stars: 5,
      body: "These guys know shortform video like the back of their hand. From organic TOF content to paid ads, they've got it all covered. They are very professional and always deliver on time. The reports have been very useful.",
      name: "Matt Heytens",
      title: "Growth Lead",
      company: "Blaze AI",
      image:
        "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/1692796692924.jpeg?alt=media&token=093521dc-0ec1-4a6b-a24b-be6c723c1c78",
    },
    {
      stars: 5,
      body: "We worked with Ripple on a few launches and were blown away each time. From scripting to visuals to strategy, they just get it. Our followers keep asking who makes our videos — it’s them.",
      name: "Alisha Verma",
      title: "CEO",
      company: "Freshly Rooted",
      image: "https://via.placeholder.com/150",
    },
  ];
  return (
    <div className="container flex flex-col gap-8 items-center mx-auto py-20 pb-0">
      <div className="flex flex-col max-w-[550px] gap-4">
        <div
          className={`text-5xl md:text-6xl lg:text-7xl font-bold text-center uppercase leading-none ${h1Font.className}`}
        >
          <div>See why our</div>
          <div className="flex items-center justify-center">
            <span>Clients</span>
            <Heart className="w-12 md:w-16 h-12 md:h-16 mx-2 md:mx-4 rotate-12 fill-theme-color3" />
            <span>Us</span>
          </div>
        </div>
        <p className={`text-center text-lg  ${bodyFont.className}`}>
          We&apos;re detail-obsessed, deadline-reliable, and always willing to
          go further. It&apos;s how we operate and why our clients keep coming
          back.
        </p>
      </div>
      <div className="relative  h-[1200px] md:h-[500px] overflow-hidden">
        <div id="review-container-desktop" className="z-10 hidden md:block">
          {reviewsDesktop.map((review, idx) => (
            <ReviewCard key={idx} review={review} />
          ))}
        </div>
        <div id="review-container-mobile" className="z-10 block md:hidden">
          {reviewsMobile.map((review, idx) => (
            <ReviewCard key={idx} review={review} />
          ))}
        </div>
        <div className="absolute w-full bottom-0   z-20 flex flex-col items-center">
          <div className=" bg-gradient-to-t from-background to-transparent h-28 w-full"></div>
          <div className="bg-background w-full py-4 flex items-center justify-center">
            {/* <button
              className={`bg-background text-xl md:text-3xl rounded-full uppercase border-2 border-theme-color1 text-white px-8 py-2 hover:ring-2 hover:ring-white hover:border-white ring-offset-4 ring-offset-background ${h2Font.className}`}
            >
              See Our Success Stories
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewCard = ({review}: {review: any}) => {
  return (
    <div className="bg-[#191919] rounded-2xl p-6 flex flex-col h-fit review-box mb-[16px] ">
      <div className="flex mb-4">
        {Array.from({length: review.stars}).map((_, i) => (
          <span key={i} className="text-theme-color1 text-2xl mr-1">
            ★
          </span>
        ))}
      </div>
      <p
        className={`text-base text-primary/70 mb-8 small-text ${bodyFont.className}`}
      >
        {review.body}
      </p>
      <div className="flex items-center mt-auto">
        <img
          src={review.image}
          alt={review.name}
          className="w-12 h-12 rounded-full mr-4 border-2 border-gray-700 object-cover"
        />
        <div>
          <div className={`font-bold text-white ${bodyBoldFont.className}`}>
            {review.name}
          </div>
          <div className={`text-gray-400 text-sm ${bodyFont.className}`}>
            {review.company}
          </div>
        </div>
      </div>
    </div>
  );
};
