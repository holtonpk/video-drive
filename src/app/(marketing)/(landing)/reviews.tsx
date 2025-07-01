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
  const reviews = [
    {
      stars: 5,
      body: "The Ripple team has been great to work with. Our social have done millions of views. These guys are the real deal.",
      name: "Andy Bauch",
      title: "CEO",
      company: "Morty App",
      image:
        "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/Untitled_(1).png?alt=media&token=dfb5a13b-9296-4724-9f7f-cb1da2fc7bc6",
    },
    {
      stars: 5,
      body: "That red bull video was 🔥 , literally just got done demo'ing it to the entire company during our all hands",
      name: "Matt Heytens",
      title: "Growth Lead",
      company: "Blaze AI",
      image:
        "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/1692796692924.jpeg?alt=media&token=093521dc-0ec1-4a6b-a24b-be6c723c1c78",
    },

    {
      stars: 5,
      body: "“The Ripple team were fantastic to work with. Their passion and skill shines through in ”",
      name: "John Doe",
      title: "CEO",
      company: "ABC Inc.",
      image: "https://via.placeholder.com/150",
    },
    {
      stars: 5,
      body: "The Ripple team is absolutely dialed. They are a pleasure to work with and have delivered on every promise. I highly recommend them to anyone looking to grow on social media.",
      name: "Jason Yeager",
      title: "Investor | Founder",
      company: "MyTechCEO",
      image:
        "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/1710884757474.jpeg?alt=media&token=82267a64-c93d-45e8-9330-aeb79b7feff9",
    },
    {
      stars: 5,
      body: "“The Ripple team were fantastic to work with. Their passion and skill shines through in each interaction and their dedication to our project ensured that the final product went beyond expectation. We are delighted with the results and the feedback from our customers has been brilliant!”",
      name: "John Doe",
      title: "CEO",
      company: "ABC Inc.",
      image: "https://via.placeholder.com/150",
    },
    {
      stars: 5,
      body: "These guys know shortform video like the back of their hand. From organic TOF content to paid ads, they've got it all covered. They are very professional and always deliver on time. The reports have been very useful.",
      name: "John Doe",
      title: "CEO",
      company: "ABC Inc.",
      image: "https://via.placeholder.com/150",
    },
    {
      stars: 5,
      body: "“The Ripple team were fantastic to work with. Their passion and skill shines through in each interaction and their dedication to our project ensured that the final product went beyond expectation. We are delighted with the results and the feedback from our customers has been brilliant!”",
      name: "John Doe",
      title: "CEO",
      company: "ABC Inc.",
      image: "https://via.placeholder.com/150",
    },
    {
      stars: 5,
      body: "These guys know shortform video like the back of their hand. From organic TOF content to paid ads, they've got it all covered. They are very professional and always deliver on time. The reports have been very useful.",
      name: "John Doe",
      title: "CEO",
      company: "ABC Inc.",
      image: "https://via.placeholder.com/150",
    },
    {
      stars: 5,
      body: "These guys know shortform video like the back of their hand. From organic TOF content to paid ads, they've got it all covered. They are very professional and always deliver on time. The reports have been very useful.",
      name: "John Doe",
      title: "CEO",
      company: "ABC Inc.",
      image: "https://via.placeholder.com/150",
    },
  ];
  return (
    <div className="container flex flex-col gap-8 items-center mx-auto py-20">
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
      <div className="relative h-[1100px] md:h-[700px] overflow-hidden ">
        <div id="review-container" className="z-10">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-[#191919] rounded-2xl p-6 flex flex-col h-fit review-box mb-[16px] "
            >
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
                  <div
                    className={`font-bold text-white ${bodyBoldFont.className}`}
                  >
                    {review.name}
                  </div>
                  <div
                    className={`text-gray-400 text-sm ${bodyFont.className}`}
                  >
                    {review.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute w-full bottom-0   z-20 flex flex-col items-center">
          <div className=" bg-gradient-to-t from-background to-transparent h-28 w-full"></div>
          <div className="bg-background w-full py-4 flex items-center justify-center">
            <button
              className={`bg-background text-3xl rounded-full uppercase border-2 border-theme-color1 text-white px-8 py-2 hover:ring-2 hover:ring-white hover:border-white ring-offset-4 ring-offset-background ${h2Font.className}`}
            >
              See Our Success Stories
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
