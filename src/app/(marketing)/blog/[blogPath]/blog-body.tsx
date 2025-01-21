import {BlogPost} from "@/config/data";
import edjsHTML from "editorjs-html";
import {formatMonthDayYear} from "@/lib/utils";
import {Icons, Logo} from "@/components/icons";
import {LinkButton} from "@/components/ui/link";
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
    <div className=" pb-20 mt-20  relative">
      {/* <LinkButton
        href="/blog"
        variant={"ghost"}
        className="rounded-[8px] left-0  absolute top  flex"
      >
        <Icons.chevronLeft className="h-6 w-6" />
        Back to blog home
      </LinkButton> */}
      {/* <div className="fixed right-0 top-40 flex flex-col px-8">
        <h1 className="font1-bold text-xl">Table of contents</h1>
        {headingsList.map((section: any) => (
          <a
            href={`#${section.id}`}
            key={section.id}
            className="text-primary hover:underline"
          >
            {section.text}
          </a>
        ))}
      </div> */}
      <div className="flex flex-col w-[90%] md:w-[70%] px-4 gap-2 mx-auto md:px-[2rem] relative md:container bg-black/40 border md:text-left tsext-center rounded-md  py-4 mt-12 ">
        <LinkButton
          href="/blog"
          variant={"ghost"}
          className="rounded-[8px] w-fit  absolute  -top-2 px-0  -translate-y-full left-0  hover:bg-transparent hover:opacity-70"
        >
          <Icons.chevronLeft className="h-6 w-6" />
          Back to blog home
        </LinkButton>
        <h2 className="text-[#34F4AF]">Marketing</h2>
        <h1 className="md:text-4xl text-2xl  font1-bold">{post.title}</h1>
        <p className="text-sm md:text-lg text-muted-foreground font1 ">
          {post.description}
        </p>
        <div className="w-full aspect-video  rounded-sm overflow-hidden">
          <img src={post.image} alt="cover" className="object-cover" />
        </div>
        <div className="flex flex-col md:flex-row w-full justify-start md:items-center mt-2">
          <div className="flex  items-center gap-2 order-3 md:order-1 mt-2 md:mt-0 ">
            {post.author.id === "team" ? (
              <Logo className="md:w-10 md:h-10 h-8 w-8 rounded-full" />
            ) : (
              <img
                src={post.author.avatar}
                alt="author"
                className="w-12 h-12 rounded-full"
              />
            )}
            <div className="flex flex-col ">
              <p className="text-primary font1-bold">{post.author.name}</p>
              <p className="text-muted-foreground text-sm leading-[14px]">
                {formatMonthDayYear(post.createdAt)}
              </p>
            </div>
          </div>
          <div className="md:max-w-[60%] w-full md:w-fit justify-start order-1 md:justify-end flex-wrap gap-2 md:ml-auto h-fit flex ">
            {post.tags &&
              post.tags.map((tag, index) => (
                <p
                  key={index}
                  className="text-sm border capitalize px-2 py-1 rounded-md h-fit whitespace-nowrap"
                  style={{
                    borderColor: colors[index % colors.length],
                    color: colors[index % colors.length],
                  }}
                >
                  {tag}
                </p>
              ))}
            {post.length && (
              <p
                className="text-sm border  px-2 py-1 rounded-md h-fit"
                style={{
                  borderColor: colors[post.tags ? post.tags.length : 3],
                  color: colors[post.tags ? post.tags.length : 3],
                }}
              >
                {post.length} minute read
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="w-[90%] md:w-[70%] px-4 md:px-[2rem] mt-4 md:mt-10 relative mx-auto md:container">
        {/* <div className="grid grid-cols-[70%_1fr] gap-8"> */}
        <div id="blog">
          <EditorJsRender html={html} />
        </div>
        <div className="w-full p-4 bg-black/40 border mt-10 md:mt-20 rounded-sm  items-center flex flex-col text-center px-8 md:px-16 py-8 gap-2">
          <h1 className="text-2xl font1-bold">
            Learn how Ripple Media can help transform your startup
          </h1>
          <p className="text-sm text-muted-foreground">
            Running a startup is hard. Our teams have the experience and
            expertise to help you grow. Lets get in touch and discuss how we can
            help you
          </p>

          <LinkButton
            href="/work-with-us"
            className="mt-4 w-full px-4 text-base hover:bg-[#34F4AF]/80 bg-[#34F4AF] text-background font1-bold rounded-md py-2"
          >
            Apply now
          </LinkButton>
          {/* <div className="w-full relative mt-2">
        <Input
          type="email"
          placeholder="Email address"
          className="w-full rounded-md p-2"
        />
        <button className="absolute right-0 top-0 h-full px-4 bg-[#34F4AF] text-background font1-bold rounded-r-md">
          Subscribe
        </button>
      </div> */}
        </div>
        {/* <SideCar headingsList={headingsList} /> */}
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
