import {BlogPost} from "@/config/data";
import edjsHTML from "editorjs-html";
import {formatMonthDayYear} from "@/lib/utils";
import {Icons, Logo} from "@/components/icons";
import {LinkButton} from "@/components/ui/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

import "./blog-style.css";

const BlogBody = ({post}: {post: BlogPost}) => {
  const colors = ["#F51085", "#971EF7", "#1963F0", "#53E8B3"];

  const processHTML = () => {
    const edjsParser = edjsHTML();
    const htmlList = edjsParser.parse(post.content);
    let html = htmlList.join("");

    const headingsList: {id: string; text: string}[] = [];

    // Process HTML to add IDs and build the list
    html = html.replace(/<(h[12])>(.*?)<\/\1>/g, (match, tag, content) => {
      const id = content.trim().toLowerCase().replace(/\s+/g, "-");
      if (tag === "h1") {
        headingsList.push({id, text: content.trim()});
      }
      return `<${tag} id="${id}">${content}</${tag}>`;
    });

    return {html, headingsList};
  };

  const {html, headingsList} = processHTML();

  return (
    <div className=" pb-20 md:mt-20  relative">
      <Link
        href="/blog"
        className="rounded-[8px] w-fit flex  absolute top-12 md:-top-2 px-0  -translate-y-full md:left-16 left-4  hover:bg-transparent hover:opacity-70 text-primary"
      >
        <Icons.chevronLeft className="h-6 w-6" />
        All Blogs
      </Link>
      <div className="flex flex-col container max-w-[1000px] items-center  px-4 gap-2 mx-auto md:px-[2rem] relative  md:text-left tsext-center rounded-md  py-4 mt-12 ">
        {/* <h2 className="text-[#34F4AF]">{post.category}</h2>
        <h1 className="md:text-4xl text-2xl  font1-bold">{post.title}</h1>
        <p className="text-sm md:text-lg text-muted-foreground font1 ">
          {post.description}
        </p> */}
        <div className="bg-theme-color1 p-2 rounded-[8px] big-text-bold text-primary w-fit text-5xl -rotate-6">
          blog
        </div>
        <h1 className="text-8xl md:text-9xl big-text-bold text-primary text-center">
          {post.title}
        </h1>
        <p className="text-primary/70 small-text text-center">
          {post.description}
        </p>
        <div className="w-full h-1 border-t border-[#C1C1C1] border-dashed my-8"></div>
        <div className="flex  items-center gap-4  mt-2 md:mt-0 ">
          {post.author.id === "team" ? (
            <Logo className="md:w-10 md:h-10 h-8 w-8 rounded-full" />
          ) : (
            <img
              src={post.author.avatar}
              alt="author"
              className="w-16 h-16 rounded-full"
            />
          )}
          <div className="flex  items-center gap-4 text-2xl">
            <p className="text-primary big-text-bold text-2xl">
              {post.author.name}
              <span className=" big-text text-[#444444]">
                , Co Founder @ Ripple Media
              </span>
            </p>
            <div className="h-6 w-[1px] bg-[#BBBBBB]"></div>
            <p className="text-[#444444]  leading-[14px] big-text">
              {formatMonthDayYear(post.createdAt)}
            </p>
          </div>
        </div>
        <div className="w-full aspect-video mt-16 rounded-[20px] overflow-hidden">
          <img src={post.image} alt="cover" className="object-cover" />
        </div>
      </div>

      <div className="w-[90%] md:w-[70%] px-4 md:px-[2rem] mt-4 md:mt-10 relative mx-auto md:container">
        {/* <div className="grid grid-cols-[70%_1fr] gap-8"> */}
        <div id="blog">
          <EditorJsRender html={html} />
        </div>
        {/* <div id="blog">
          <ReactMarkdown
            children={markupDummy}
            remarkPlugins={[remarkGfm]}
            className="whitespace-pre-wrap"
          />
        </div> */}
      </div>
      {/* </div> */}
    </div>
  );
};

export default BlogBody;

const EditorJsRender = ({html}: {html: string}) => {
  return (
    <div
      dangerouslySetInnerHTML={{__html: html}}
      className="h-fit overflow-scroll w-full  text-primary  editor-js-view flex flex-col gap-4 "
    />
  );
};

const markupDummy = `
## Short Form Content for Business: Insights and Strategies

Short form content has become a crucial component of modern business marketing, offering numerous benefits and opportunities for engaging consumers effectively. Here, we will delve into the key aspects of short form content for business, exploring its benefits, effective strategies, impact on consumer engagement, platforms for promotion, and trending analyses.

### Benefits of Short Form Content for Business Marketing

**Brevity and Engagement**: Short form content’s concise nature makes it highly effective in capturing audience attention. It is particularly suited for today’s fast-paced digital landscape, where users are overwhelmed with information and have limited time to engage with complex content.

**Cost-Effectiveness**: Creating short form content requires fewer resources compared to long-form content, making it a cost-effective strategy for businesses of all sizes. It also allows for easier distribution across various platforms.

**Data Collection**: Short form content can be quickly analyzed to gauge consumer preferences and trends, providing valuable data for future marketing strategies.

### Effective Strategies for Creating Short Form Content

1. **Focus on Visuals**: Use high-quality visuals like images, videos, or animations to convey messages quickly and effectively.
2. **Storytelling**: Leverage storytelling techniques to create an emotional connection with the audience.
3. **Relevance and Timeliness**: Ensure that content is relevant to the target audience and is released at the right moment to maximize engagement.
4. **Interactivity**: Encourage audience interaction through polls, quizzes, or Q&A sessions to build engagement.

### Impact of Short Form Content on Consumer Engagement

**Instant Gratification**: Short form content provides instant information and entertainment, appealing to consumers who seek quick and easy-to-digest material.

**Increased Sharing**: Because short form content is easily consumable, it is more likely to be shared across social media platforms, increasing brand visibility.

**Builds Community**: Engaging short form content helps build a community around a brand by fostering discussions and interactions.

### Short Form Content Platforms for Business Promotion

- **TikTok**: Known for its short-form video content, it is ideal for businesses aiming to engage a younger audience with creative and entertaining content.
- **Instagram**: Offers features like Reels and Stories that are well-suited for short-form visual content.
- **Twitter**: Especially effective for short-form text-based content, often used for real-time engagement and news sharing.
- **Snapchat**: Provides ephemeral content that is engaging and conducive to encouraging urgent engagement.

### Analysis of Trends in Short Form Content Marketing

**Rise of Video Content**: Video remains a dominant trend in short form content, with platforms like TikTok and Instagram Reels seeing significant growth.

**Personalization**: There is an increasing focus on personalizing short form content to appeal to specific audience segments, enhancing engagement and relevance.

**Cross-Platform Integration**: Businesses are leveraging multiple platforms to ensure their short form content reaches diverse audiences effectively.

**Sustainability and Authenticity**: Consumers are valuing authenticity more than ever, requiring businesses to prioritize genuine and sustainable messaging in their short form content.

### Conclusion

Short form content has revolutionized how businesses approach marketing, offering a powerful means to capture audience attention, drive engagement, and boost brand visibility. By leveraging effective strategies and embracing trends in short form content, businesses can create compelling, shareable, and impactful content that resonates with their target audience. As technology continues to evolve, the importance of short form content in business marketing is likely to grow, making it a vital strategy for businesses looking to stay relevant in a fast-paced digital world.
`;
