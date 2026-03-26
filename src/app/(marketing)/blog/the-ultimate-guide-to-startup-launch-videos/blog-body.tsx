import React from "react";
import Link from "next/link";
import {Icons} from "@/components/icons";
import localFont from "next/font/local";
import {VideoPlayer} from "./video-player";
import "./blog-style.css";

const h1Font = localFont({
  src: "../../fonts/HeadingNow-56Bold.ttf",
});

const bodyFontLight = localFont({
  src: "../../fonts/proximanova_light.otf",
});

const bodyFont = localFont({
  src: "../../fonts/proximanova_regular.ttf",
});

const bodyBold = localFont({
  src: "../../fonts/proximanova_bold.otf",
});

export const BlogBody = () => {
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
        <div
          className={`bg-theme-color1 p-2 rounded-[8px] text-primary w-fit text-5xl uppercase -rotate-6 ${h1Font.className}`}
        >
          blog
        </div>
        <h1
          className={`text-6xl md:text-7xl text-primary text-center ${bodyBold.className}`}
        >
          The Ultimate Guide to Startup Launch Videos
        </h1>
        <p
          className={`mt-4 text-primary/70 text-center text-xl ${bodyFont.className}`}
        >
          We analyzed 1,000+ startup launch videos, across YC companies,
          breakout products, and everything in between, to figure out what
          actually works.
        </p>
        <div className="w-full h-1 border-t border-[#C1C1C1] border-dashed my-8"></div>
        <div className="flex  items-center gap-4  mt-2 md:mt-0 ">
          <img
            src={
              "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/profile.png?alt=media&token=a973ee0a-ff42-43a5-86e1-d52325696d14"
            }
            alt="author"
            className="w-16 h-16 rounded-full"
          />
          <div className="flex  items-center gap-4 text-2xl">
            <p className={`text-primary text-xl ${bodyFont.className}`}>
              <span className={` ${bodyBold.className}`}>Adam Holton</span>
              <span className=" text-[#444444]">
                , Co Founder @ Ripple Media
              </span>
            </p>
            <div className="h-6 w-[1px] bg-[#BBBBBB]"></div>
            <p className={`text-[#444444]   text-xl ${bodyFont.className}`}>
              March 26, 2026
            </p>
          </div>
        </div>
        <div className="w-full aspect-video mt-16 rounded-[20px] overflow-hidden">
          <img
            src={
              "https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/A_cinematic%2C_high-end_202603262245.png?alt=media&token=13217789-be71-4057-9aec-a3e9a2e8664d"
            }
            alt="cover"
            className="object-cover"
          />
        </div>
      </div>
      <div className="w-[90%] md:w-[70%] px-4 md:px-[2rem] mt-4 md:mt-10 relative mx-auto md:container">
        {/* <div className="grid grid-cols-[70%_1fr] gap-8"> */}
        <div id="blog" className="editor-js-view">
          <p>Most startup launch videos are forgettable.</p>
          <p> Not because the product is bad.</p>
          <p> Because the execution is.</p>
          <p>
            {" "}
            Founders spend months building something great… then ship a launch
            video that no one watches, no one shares, and no one remembers.
          </p>

          <p>We’ve seen it over and over again.</p>

          <p>So we decided to study it.</p>
          <p>
            We analyzed 1,000+ startup launch videos, across YC companies,
            breakout products, and everything in between, to figure out what
            actually works.
          </p>

          <p>
            The patterns are clear. Here is the best guide to a startup launch
            video (with actual examples):
          </p>

          <h1>Launch Videos Are Distribution, Not Explanation</h1>

          <p>
            Most founders think a launch video is there to just explain their
            product. It’s not.
          </p>

          <p>
            A launch video is a piece of content. And content lives or dies on
            attention.
          </p>

          <p>It needs to:</p>

          <ul>
            <li>Stop the scroll</li>
            <li>Communicate fast</li>
            <li>Be interesting enough to share</li>
          </ul>

          <p>
            Because if it doesn’t spread, it doesn’t matter. The best launch
            videos aren’t just seen. They earn attention and convert it into
            interest.
          </p>

          <h1>Why Quality Matters</h1>

          <p>We’re in a weird moment.</p>

          <p>
            It’s easier than ever to make video. But it’s also easier than ever
            to make something that looks cheap, generic, or forgettable.
          </p>

          <p>
            And in categories like AI, SaaS, and without a doubt consumer, how
            your video looks directly impacts how your product is perceived.
          </p>

          <p>
            Low-quality execution doesn’t just hurt engagement. It hurts brand
            perception.
          </p>

          <p>That doesn’t mean you need a massive budget. But it does mean:</p>

          <ul>
            <li>Your visuals need to feel intentional</li>
            <li>Your pacing needs to be tight</li>
            <li>Your message needs to be clear</li>
          </ul>

          <p>
            Because good ideas don’t win on their own. They need to be packaged
            the right way.
          </p>

          <h1>Core Insights From 1,000+ Launch Videos</h1>

          <p>
            After analyzing 1,000+ startup launch videos, a few patterns show up
            again and again. These aren’t preferences. They’re what actually
            drives attention and engagement.
          </p>

          <h2>1. The First 5 Seconds Decide Everything</h2>

          <p>
            Most viewers decide instantly if they care. If your video doesn’t
            create curiosity, clarity, or tension immediately, the viewer is
            gone.
          </p>

          <p>So how do you get attention in just a few seconds?</p>

          <p>
            You can use visuals, verbal cues, text, or audio elements. The good
            ones use multiple. It just has to be something.
          </p>

          <p>Here are examples of all four types of hooks:</p>
          <VideoPlayer
            className="rounded-[12px] shadow-xl"
            src="https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/2023789545242710115-chasi.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=HNdSedD%2BMO2%2BaYjN7TKLUBcUx4GFLq16YHQhyRlNr%2F8c03wGjk7WpejsRfP%2BefQEeyFTesVYmcpyD1SuSJIDoUZ5lQzi7wzFl2WOYyDfOCXBlHg6hKylLvUe9kpanKsn8s%2FwX84%2BCx2RcBqVxjypKd53KgEI%2BDum5X23khaklTMpF7eZ7w5dSwa205oFN5BM5D6a6QQLjPkM3V6KBJOR%2Bug%2FQ5cJWvQ37zeKDvmOW0O%2BXhaPCmekGq6JIGFk5ffK4KhEmE6mK1BekHz1lTD5GUztMVA7iqwJn04reyqe9d3cKE4Wclu6%2FrE84%2FBYBdPg0bvqD5jVbUNrJG5W%2BKzUYw%3D%3D"
          />
          <p>Visual — Chasi</p>

          <VideoPlayer
            className="rounded-[12px] shadow-xl"
            src="https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/1962923480879608063-wondercraft.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=lvVEwNMd8WzZnwD%2BD0l%2FOVCzhmG3A78WoUsyX0WRPcasLrxbG3DE1sWBRS3tT7b6Ck0%2Br4Ws9HJdvAMD2jne0qYqn37URqhRI%2Fv7mO3pqfyi%2BfQjfJ5DLnYJPZm2x5W2SUEqEa6pafY07Ryxlq92nC1wtuTA%2BujbE2V1hBKI7qeAxMy2%2BgVhv3%2FuKQFblAvVOvi%2BPwGvoIQICRq%2BeErFn8087tG9DKsKmC45nM9gnGC9RmKaRQks7uL7HgBxgL%2BlfStjMEo1qICxOB7L9VIQQ41hquPUEo7IaqGDxxPHHnHqRmjXFR%2BwBtNdtFfkDdcr7Ia1Z%2B2bIZk5lV6d6pWGYg%3D%3D"
          />
          <p>Verbal — Wondercraft</p>

          <VideoPlayer
            src="https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/2018731211737137341-rev1.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=W%2Fz%2BL3HOBxZljdoSuvL9S64%2FyUvZx3jyO2t9wKUuczwsujWD%2FF1E%2FJkSRnADyKdjZ%2BfXYk1H2LoAanwCApSLzrjdkyaRKoKgyWKnQxYhyZZ89YcbhFB%2FZlUPGpuuf%2BQLFpRWgGTgZM39f1Xerig7fAlqouwTBR78keXbWQUrIcRDYu6i5InemzGLkhMKhFNMPrHD6ohRNSo%2Fbsh1iY9C0%2Fr0SeLq9ljqs%2BucPT%2FcOr%2BJrCS3tidG1opdJ4oTff3Ah7h%2FnNxb2fEPfYSMGeasSZrPc8YrXCaDj8IFTrf3KSVvYVln%2FiApO5eahzlq4uOns7F9V9g7UxiCEmZpsQ01IQ%3D%3D"
            className="rounded-[12px] shadow-xl"
          />
          <p>Text — Rev1</p>

          <VideoPlayer
            className="rounded-[12px] shadow-xl"
            src="https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/1945196673199735232-goriff.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=L9iudAqLdKdDklFQnmnLbwz6TayiFTtxryKOnN7f8IKZdYIQeHOEPs07OE4BCMoN%2Fm2GTx8j%2FopdGErceBNMhmbGMQifBYXZmIqqeyMhxxCsjYq8HC6FGcQqRCpHLScSQSyfpjgughcfI2mWkGmuRl9gEslISgpM1FsgBJf%2BTEfhhzyQH4osPEUhYf7J3Iz%2B%2B%2FNBXXYkkaMbCgZw743paRZdDO8RlIo%2Bpp%2BSDyPDEgQYzORDsV70g%2BJ18%2F8ZMjjXrKMYEfqr8Vset7rqDc8fUyF6IZ4cQUQlVH1erNVUzaCU5GSigfC0WJJH5p%2F0UXt%2F3IWWbuEsgEmWmAORnciunA%3D%3D"
          />
          <p>Audio — GoRiff</p>

          <h2>2. Attention Comes From Intrigue, Not Information</h2>

          <p>
            The videos that stand out don’t just inform, they create interest.
          </p>

          <p>
            A question you want answered. A problem you recognize instantly. A
            moment you need to see play out.
          </p>

          <p>
            The best launch videos do this intentionally, using emotion,
            novelty, clarity, or creativity to pull you in.
          </p>

          <p>
            This is why the best demos are often disguised as stories. They
            don’t just show the product, they make you follow along.
          </p>

          <p>
            Here are examples of launches that do a great job creating intrigue:
          </p>

          <VideoPlayer
            className="rounded-[12px] shadow-xl"
            src="https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/1985391530090127424-unsiloed-ai.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=nkhPx8RZVl176aqIcAke5AfnVlSGdBzUCXPJlUUZ8o8goeNITuKcS%2FuIS8yffCzeR2QUUwiwtWU82%2F0knwdrjAhKBfl3WWZJ59UWNk2H9Ihk9npWqfAPs9nSZU2EGqDJG8s5OqchW4f%2FC1wxwz384SY%2F6Wwp2d9fzQ2VnhzNg30xJSuQ5ZeVPlmgw0IJdBNWMaQUvRBm4kDiOnMRO34qaTsfbKSFHVwhVhgXcr4OoAn7lFTeRkdbEHlGHA8t3U4hTf%2Fqr2gOft54QKLBZ7w2ODBcI3U0sBQz3yMCIDOb26P1wNxoHeLhQhV980QIBjrk5VBwt6hDF50p%2FqlkYKbXGA%3D%3D"
          />
          <p>Unsiloed</p>

          <VideoPlayer
            className="rounded-[12px] shadow-xl"
            src="https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/1948465725775270235-stockline.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=UBYlfFMt9Zhqqx5XGXPIPq6YaXfq6KP9t%2BuJkS9iQKQ0subkqz9zoN%2BTXTrEPCPT14Hy5wWgMo4wTIHZGDLU70Ln6bNICHswDjdEkvl8AA0YP7Lh4iQIVDGFCcDWy0RqFuXMJe9At%2Fta52v3oq8PzXIrj1XiuJ50M1o%2B1uvDrTo1blGoo0I8ft8VRm1zQAMFnql1ZoUOxFaasCW7b3idJ8zIFkNAnFrQ8I5PMQxvq%2BRXWcMNDn5VxtnvxjMWA%2FSRn1wu7wsQnJPtD3%2FbefG3%2FlP%2FqMJ57pG85dzQJIzzjQfDuRf5AH1hlsH4f%2F0rnFjxOSgLviSVfNzELH9X5J6I0w%3D%3D"
          />
          <p>Stockline</p>

          <VideoPlayer
            className="rounded-[12px] shadow-xl"
            src="https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/1922698429660119331-cotool.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=d0RcJ6kpGjNNRqzzXkU0PEMtXenvm4wjQgIEk7qEyyprnLhz5O7r1nvS8CYUXD25lye8FuUD9jJ%2Bn%2BUjXPBbGD1gJET3X8bjhnGOqSbxXLwiLe93hvDkzu7LFpSmJ%2FJT00kAYyXu0ff%2F3Y093QuzyyWKE5yF6yqPt%2FkGjXHArTrXEwpU2tSeJii7FFFq40MYEhrBEodZyqsqBOJW%2BkIEiYSNdDOOvbsvmN7%2BjYEeYHnxOgc9ovZyX8uVJjqLCLgAvxzvWBKYJk5ZbDOqXnlmDwDOro7zD4kpX0Egflcu35IapGAQKKa4heGprl%2FzEq9gQazMtUJqUivolAhOLnAr1Q%3D%3D"
          />
          <p>Cotool</p>

          <h2>3. Show, Don’t Explain</h2>

          <p>
            From an engagement perspective, showing beats telling every time.
          </p>

          <p>
            The best launch videos don’t rely on voiceover to carry the message.
            They make the value obvious through what you see.
          </p>

          <p>
            If someone has to listen closely to understand your product, you’ve
            already lost them.
          </p>

          <p>Here are examples of good visuals that do the heavy lifting:</p>
          <VideoPlayer
            className="rounded-[12px] shadow-xl"
            src="https://firebasestorage.googleapis.com/v0/b/video-drive-8d636.appspot.com/o/launch-library%2Fvideos%2F1975224529002844516-sorce.mp4?alt=media&token=e38b3404-490f-4c1b-8182-ccd3f16e8415"
          />
          <p>Source</p>
          <VideoPlayer
            className="rounded-[12px] shadow-xl"
            src="https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/1970573884442460196-basedash.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=RxBka4PJNXXIjvQ44e%2FIxjoeTJPLKQytWSlOwB%2FWARzN1AlsA1azNSVEapO91CF20K3MZNaLN6BDnDXzFaYcdXNqe4ggs5pGpn5YeZESKW5s08apnRTzBMfcLvpa0BgWvqTTWWaWEyO1dHPn%2BG6zOR8yIRULn3F%2BuXDfmXNzxtBjI8zxNKs6MBOlqX9NDknNTe0NvD4WGhe2%2BcfYUKmonT2HB75lAY6M8N9yqIg%2FT08Jd2JhW5T%2BjxP9uOfhMzeq87OS9IblftWo4rJgKHSS20CmgFRuHTtz4tyqkZNAGlhFp1WoPwQb%2FgsOw29HBa7sFrYAcE8ix5%2Bo8fPtgM77KA%3D%3D"
          />
          <p>BaseDash</p>
          <VideoPlayer
            className="rounded-[12px] shadow-xl"
            src="https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/1983564490953372099-bear.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=YVLWDk%2F2YcMpLk4mv2wM93O2Y1c3aYdGw9qIXdaWlytDCA%2FQNByeEWGrwFLTUrI02bl25pUgJK6lvy2CF5Yt8iQsWREp7qdVoTx18jDBTfCAfzihckiMWbKZjgsA9cm8cAuQtcqUBwX5p2LkGr71CBy02uFxq%2B1oYEk2KGb3pSv%2BizbxMPhbfSllzh8umRyrlZuN%2BKYNvzeiAY8ps1kR1PZY7un3%2FJ4pxFFe2j040ZIJbYkusckInru3rM9yWj8XDTRU8Hikj6j1hWWMSEGDO%2F80H%2BCUcX%2BmLqW3M3L8wSrM9t2DyB94iGjhs210EoHtbrBG8gCBAnJKR7lOYfA7Xg%3D%3D"
          />
          <p>Bear</p>

          <h2>4. Simplicity Wins</h2>

          <p>
            Most founders try to say too much. Features, use cases, edge cases,
            everything. Listing off this and that kills message retention.
          </p>

          <p>
            The best videos communicate clearly. If it takes effort to
            understand, it won’t spread.
          </p>

          <p>
            The best launch videos are easy to understand on the first watch.
          </p>

          <p>Here are examples of very good messaging:</p>
          <VideoPlayer
            className="rounded-[12px] shadow-xl"
            src="https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/2031369491049808072-palus-finance.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=Xx0qVUU1iu7ce1cURqqBlJiMFUaG5euFaWF9jeaXsnChtmMx5%2BkL6%2FSAAteTrsSLxYqyB24Wbm%2BSVKn9hsoitFCY%2F6dcl0arDbbT1oL51oS5Cul9%2B0r%2F9XwybU6M4PPvqLuylsb7xWaZ3ybUZeebUY%2BS4nb%2BsPdWd5GVjMWRNtzoUbWr8IKnmc6irdGfqCeQKAuG0lmPUMHzwtJFJeSh9FZGCyIU0JsskytgPipOfh9RiXtUir6EUxQfwCAP%2BbMdnwQ8hNo4V542c%2BhOpMYCoQzthP6IOQ9eAJSfRGBUryI7CiAwgAeMUoQuSrIfvq2WIvggrAOPJ2tzD9jBR50pUg%3D%3D"
          />
          <p>Palus Finance</p>
          <VideoPlayer
            className="rounded-[12px] shadow-xl"
            src="https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/1978158867499331586-zavo.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=Kuvh1Ft%2FhtEuqVLMX0%2F%2Bm4dLc8XgUFibZl0jVpSZkNppj7Z6cMcB2SaNBd3LFVaaUapfUvVoSPgV6UzyHTvCit%2B5As%2B%2BsA%2BusqyMPfqMO13b%2BR6wwhtAFJXcODkZSRAEHwSLhVpMshLIM0a4T6XOOscKbJszx1T16WmBtHVcOYsXTzvMB%2BTOQH%2FTMHdYhMfXRXRgV%2F0%2FgNN8AQjDqD8VtHPfIvwKGZTdXrMUj203v6P13zz4CjN611S9xfK1h7XX5dcneg1Mk6%2Fz94K62Lns2ApNHKgr9GTTswrvhGsBYOuq35EJjHt8qtay2I0e0ThqpPb7jQSGeVGZSlqZIJA0BA%3D%3D"
          />
          <p>Zavo</p>
          <VideoPlayer
            className="rounded-[12px] shadow-xl"
            src="https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/1980302994408403184-uplane.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=fqxRN8YWcf5P4kulUvP1fCzmghiwwFzCpvZNe%2B%2BAvoIKtwnjP6nqu9pKBkDm76PVH5%2F8uInbtl0PRdZNKR8TtfD0fJ8U%2FsOX2q%2B4koYKSBs%2BIQzi8h7O7%2Bao15EKpLj86v1BeaSD12r0kGMIVMp6W3BThpIGXDtDx%2FdoHcM80Uur%2FhDIFWnOBwzOKjtumCtzqm5j%2FpHd14Ykw13vHu2rxnxK5vlOpunajiQRbxIV4l9sTgbPBJte2yDrNc6gUw4d9ttOANB0vRn5ilfEJIuB0m0pkikYdgeqssyUcatJL%2FYKL%2F13v89Q0uJh60shZtPuRnN8pdk5OuNH4INa05bv3w%3D%3D"
          />
          <p>Uplane</p>

          <h2>5. Pacing Is Everything</h2>

          <p>Every second needs a reason to exist.</p>

          <p>
            Good launch videos move. Cuts, motion, or new graphics every few
            seconds. Dead time kills attention. Tight pacing keeps people
            watching.
          </p>

          <p>Here are examples of great pacing: </p>

          <VideoPlayer
            className="rounded-[12px] shadow-xl"
            src="https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/1978176112740950504-absurd.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=PFjVzuFXpUHSo%2BmHIhyQTF9q%2BuIUmi%2BX6L5Qi4pMuXDlWRQluQ6AAKjuwsQdhfrxXfVeCvWK1dFde4IOAfeN%2FGINHuGHswfBzm0qNEUoG76phxPzjf2BMqK%2BFk4x8e9XhxoEyj6PK5LqIwYA5Am7FrGqTG%2F9ecBqUo%2FNpUyWE75FblCg2wjVGfJjL4VhekUJQkJmTJ4eKxn%2BYAGijq53a%2Fizj7NHyqlYMcV%2ByAMXj72gx0n92XxxLAFMMgrpZxRSqfkta5k1V8QUHa1TCu9aNrug3SEfDaTUvR7F%2FlmVsv0ZkSELGtxD5pEbujLQt30Yg15DgNqlf0RM8beuRy3Miw%3D%3D"
          />
          <p>Absurd</p>
          <VideoPlayer
            className="rounded-[12px] shadow-xl"
            src="https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/1968701548135071772-blacksmith.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=aJcom7FcnvS6Gi%2BROKwN130pMUw5meU52kPog7zWXDQXmK4Ks0AbJroZcrB3GpOEx4BekW0MN5mvKUqeN9qo0k%2FNE9ripzIVn9JSRLWCPKvpQUdkkJwVcPiuqfBJXmG8b3e4%2F%2FpAVcK16mtdazaNDgwh1HEbbEUp8uz3SeL%2F94WtAMWNwk7Jogtp3GZMUXB4Mr6h8s53Jx2FQpbAl29jeFvVa%2BTVI1oJdsToxuHiwW3BhLA%2B1qc7AZTaM6IbZQSYIEuObWB5i9MUttaNWXjOliGGqTsrsYH8endcS6hKTxX0Xkj1wAntwHBFhgQggda8%2Bd6%2BfW9fV81mLNpryLw82g%3D%3D"
          />
          <p>BlackSmith</p>
          <VideoPlayer
            className="rounded-[12px] shadow-xl"
            src="https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/1986146628970160225-flick.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=UGyvGaoV3Ots%2BsxvUaN%2BMxCIBShtpUEn6PQaxAFg2BbrggTBjHd%2FHYqVFjsiy6GGbK0rPJrC8%2FtiXVlfDr9sD2HQWkIOUdCH8vHhUuI%2B07i%2Bxr3zPAulCHKyAHcuemVNR7lgRUqKvpmP2Qr4Psm8KBD7UAQUIG4B7FXCbIe9DSF6qOkljbMDTT3juvlnT1eb7TxwGEAxiZkO%2B%2FaWgLzuCSnsSCukoq1CdaBIc4clMIQ0hzgzOVcCFTCHSbu0JNVm6JjObcfTmU11OPg3OkttPOrHrvU1PDqBInj0iZr%2B7IT%2B%2BSQU57v2a%2BoZh39kDJkMoBJez9ZAsnzDtooF%2BIv0ZA%3D%3D"
          />
          <p>Flick</p>

          <h1>Formats That Work &amp; How to Choose Which One to Use</h1>

          <p>Picking the right format is where everything starts.</p>

          <p>
            Before you think about script, visuals, or production, you need to
            decide what kind of video you’re making. Because different formats
            solve different problems.
          </p>

          <p>
            Some build trust. Some create clarity. Some are designed to grab
            attention and spread.
          </p>

          <p>
            The mistake most founders make is jumping straight into execution
            without thinking about the goal of the launch.
          </p>

          <p>What are you optimizing for?</p>

          <ul>
            <li>Trust</li>
            <li>Clarity</li>
            <li>Attention</li>
          </ul>

          <p>
            Your answer should determine the format. Because the same product,
            with the same message, can perform completely differently depending
            on how it’s packaged.
          </p>

          <p>Here is a very general breakdown of four main formats.</p>

          <h2>1. Founder-Led</h2>

          <h3>What it is:</h3>
          <p>
            The founder speaks directly to the camera, leading the communication
            through the video.
          </p>

          <h3>Why it works:</h3>
          <ul>
            <li>It can build trust effectively</li>
            <li>
              Customers and investors want to hear from the person actually
              building the product, especially early on
            </li>
            <li>Feels authentic</li>
          </ul>

          <h3>When to use it:</h3>
          <ul>
            <li>Technical or complex products</li>
            <li>Early-stage companies</li>
            <li>When credibility matters more than creativity</li>
            <li>
              When the founder is comfortable and competent at communicating
            </li>
          </ul>

          <h3>When it fails:</h3>
          <ul>
            <li>Low energy or unclear delivery</li>
            <li>Bad audio or weak visuals</li>
            <li>Over-scripted or unnatural tone</li>
            <li>Lack of visual engagement</li>
          </ul>

          <h3>Budget:</h3>
          <p>Low → Medium</p>

          <h3>Key insight:</h3>
          <p>Clarity and confidence matter more than polish.</p>

          <p>
            <strong>Example:</strong> Avelis Health
          </p>
          <VideoPlayer
            className="rounded-[12px] shadow-xl"
            src="https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/1957834946032120040-avelis-health.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=dYOCPt1HntmZeZ9mFCfh7l63EyKi6xzAiH%2FbLuqLhWVkRLU0MCkz1hWRVVohrDITusrrvQ%2FKF5t3VXDyed%2FyFE%2B0hN9LfGGIfjkMnlxHevwlzLfwonprnnFU0ysEOtWvupQs0TVQr8s1cGpi65nijYHVifCVTGOJbNDhMxxgu%2FqXMjxox4%2BYbLUDM6RGPcjV6Toqk4aMOCPGX2kHZiG4zXe48tdSzdRUO7BMSGRPHM6eiEP3vb6Sw3Izq%2FkUbTFlkY83Be08LlDoNcXJyRtF1WR%2BDtuCCa%2Bxd%2BC7itf9m6X6ZxdzMNOZmcGcSZPsdrl9fksMgNkxqaf%2BqT9krrNY5g%3D%3D"
          />
          <h2>2. Product Demo (Explainer)</h2>

          <h3>What it is:</h3>
          <p>
            A breakdown of the product using UI, motion graphics, and/or
            voiceover. The classic SaaS-style video.
          </p>

          <h3>Why it works:</h3>
          <ul>
            <li>It makes the value obvious, fast</li>
            <li>
              If your product is visual and intuitive, this is the most direct
              way to communicate it
            </li>
          </ul>

          <h3>When to use it:</h3>
          <ul>
            <li>UI-driven products</li>
            <li>Simple, clear value propositions</li>
            <li>When understanding is the priority</li>
          </ul>

          <h3>When it fails:</h3>
          <ul>
            <li>Turns into a feature dump</li>
            <li>No hook or narrative</li>
            <li>Feels like a tutorial instead of a launch</li>
            <li>Screen recording walkthrough with no intention</li>
          </ul>

          <h3>Cost / Effort:</h3>
          <p>Medium → High</p>

          <h3>Key insight:</h3>
          <p>
            The best demos don’t explain everything. They make the value
            obvious.
          </p>

          <p>
            <strong>Example:</strong> Alloy
          </p>
          <VideoPlayer
            className="rounded-[12px] shadow-xl"
            src="https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/1983646079095902309-alloy.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=aukvWIy7t%2FbT%2FGx0U1r6KIX3MEmAk1%2BjIF1BNRmOW0MMBhU2eyY2FuVGEmLRJuno6MeppJGoAgRo95rfaEB3A5xLGhARx4DNfmxcHFP3HdIKlbeI0Bg243QKubVSQPQ3rXsnSf10R74WOt4TBJr7ieQa7aVP0qhWe90tYFA7zjHNxDnNZRGSvmYlWrCikWbdPVvqfJp9Fdwk%2FZMCb%2FLNgG5vqSrdMg3N2RlgbBoDa2mhAjs0dJUVaNrSy9334S2lQJ3lXIfs9TFWTSNhEcNbxzoXm1UjJzhWsmcyQC%2FwmUKmklYq8g4%2FAU5Q7qGjvUh0XhhKMns%2FuASi5Mwvq0GxiQ%3D%3D"
          />

          <h2>3. Brand Film (Narrative / Story-Driven)</h2>

          <h3>What it is:</h3>
          <p>
            A story-led concept. Could be cinematic, symbolic and abstract, or
            structured like a short film.
          </p>

          <h3>Why it works:</h3>
          <p>
            This is how you stand out. It creates emotion, memorability, and
            shareability.
          </p>

          <h3>When to use it:</h3>
          <ul>
            <li>Competitive markets</li>
            <li>Big launches</li>
            <li>When brand matters as much as product</li>
          </ul>

          <h3>When it fails:</h3>
          <ul>
            <li>Too abstract, no clarity</li>
            <li>Doesn’t connect back to the product</li>
            <li>Looks good but says nothing</li>
          </ul>

          <h3>Cost / Effort:</h3>
          <p>Medium → High</p>

          <h3>Key insight:</h3>
          <p>The story creates interest. The product converts it.</p>

          <p>
            <strong>Example:</strong> Happy Robot
          </p>
          <VideoPlayer
            className="rounded-[12px] shadow-xl"
            src="https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/1963310947470344353-happyrobot.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=OvVkdamSQqQ1dL6Zs3hw2dYufKRza0b8Y3kiLni%2BOseNnSo8PnwY31Bm3AFOS%2FyadQjFD7d4z%2BDQyOZLs44DQEEyEeRVyMH2kNbFImO5iBxILBPctm5EHOpQy0zBVYciT%2B14eXJUqux3g%2FW6%2F1%2Fky%2FLl2SYbot5XVbGG2AB1%2Bq1JR%2Fq4eVODEXRAAh6IoxCcFXayTvWMEGRv5Fjn0540eO9RKC4gLSal8kf8TlaWz0vi23OlXvPsiiAZzyYyCKzHQVLSs3RyE6yHy99pglpOT9eBo05lbmwEt7DkqtFWUrY%2BVvoEfNFfHH3wSzUy%2BBYYxGwJKez4ym12G%2FBegG9yeg%3D%3D"
          />
          <h2>4. Hybrid (Founder + Demo + Story)</h2>

          <h3>What it is:</h3>
          <p>
            A combination of formats, blending founder-led, product demo, or
            narrative elements into one video.
          </p>

          <h3>Why it works:</h3>
          <p>
            It combines trust, clarity, and attention. Instead of relying on one
            strength, it layers multiple.
          </p>

          <h3>When to use it:</h3>
          <ul>
            <li>You want both clarity and attention</li>
            <li>You have a strong product and a strong story</li>
            <li>You’re aiming for a polished launch</li>
          </ul>

          <h3>When it fails:</h3>
          <ul>
            <li>Feels unfocused or trying to do too much</li>
            <li>No clear structure or flow</li>
            <li>Transitions between formats feel disconnected</li>
          </ul>

          <h3>Cost / Effort:</h3>
          <p>Medium → High</p>

          <h3>Key insight:</h3>
          <p>
            Hybrid works when it’s intentional, not when it’s everything thrown
            together. It needs to feel cohesive in style, messaging, and pace.
          </p>

          <p>
            <strong>Example:</strong> Asimov
          </p>
          <VideoPlayer
            className="rounded-[12px] shadow-xl"
            src="https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/2031384589898539341-asimov.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=JWghobxFVI2GqbK%2Bx5n%2B4zNQRGUkJePT62vAqwnIr3yuUXcdfe10zNWrpNKhuQCRkXfirvKVOJI%2Bl5w8NueXMWC1C9qffBD1iyHVYtYvznP6AMZmjP1Gacdk1wZfd4NlI%2Biydb7Xt3Sw05fkmyABcb3z3IOXhGIfgvcE2UaMzB%2FfiZD7baNIo7%2FYwxFGXPH%2F8F82lGx0cZ97EH4SKwMguo%2FHimyocTl4ZyIYgGfzC%2B8YR5Xj%2BNBm1puYP93TlMMir3Oa8f%2FNcCKXDbBxQcTQItq8qnlRbbam1Wedn5n5cZtfet08S8OG14bVMCpuV5MYh07lOfphBZ7xic6ES%2Bu3sg%3D%3D"
          />

          <h1>Common Mistakes</h1>

          <p>
            Most launch videos don’t fail because of bad ideas. They fail
            because of avoidable mistakes.
          </p>

          <p>
            After looking at thousands of videos, these were the most common
            mistakes:
          </p>

          <ul>
            <li>
              <strong>Trying to say everything</strong>
              <br />
              Too many features. Too many use cases. The best videos communicate
              one clear idea.
            </li>
            <li>
              <strong>No hook</strong>
              <br />
              If nothing grabs attention in the first few seconds, it’s over. No
              hook, no reason to keep watching.
            </li>
            <li>
              <strong>Feels like a sales demo</strong>
              <br />
              Feature walkthrough. Step-by-step explanation. Boring screen
              recording. That’s not a launch video, it’s a tutorial.
            </li>
            <li>
              <strong>Too slow</strong>
              <br />
              Long intros. Dead space. No movement. No music. If nothing is
              happening, people leave.
            </li>
            <li>
              <strong>Looks cheap in a trust-heavy market</strong>
              <br />
              Low-quality visuals don’t just hurt engagement. They hurt
              credibility. If you are going to record your own footage, use good
              lighting, a stable camera, and a mic. That’s the bare minimum, but
              it makes a big difference.
            </li>
          </ul>

          <h1>A Simple Framework You Can Use</h1>

          <p>
            If you’re trying to execute a launch video on your own—without a big
            budget—you don’t need to overcomplicate it.
          </p>

          <p>Use this:</p>

          <h2>1. Hook (0–5s)</h2>
          <p>
            Pattern interrupt. Start where it gets interesting. A bold
            statement, a clear problem, or a visual that stops the scroll.
          </p>

          <h2>2. Problem (5–15s)</h2>
          <p>
            Make it felt. Show the pain clearly and quickly. If the problem
            doesn’t land, the product won’t matter.
          </p>

          <p>
            If you can tie a personal connection to the problem, that always
            helps.
          </p>

          <h2>3. Solution (15–30s)</h2>
          <p>
            Introduce the product. Keep it simple. Focus on the core idea, not
            every feature.
          </p>

          <p>
            You can use a screen recording, but cut it up so it’s engaging. Zoom
            in and out for emphasis on what you are showing.
          </p>

          <h2>4. Proof (30–45s)</h2>
          <p>
            Build credibility. Show it working. Use visuals, results, or context
            that makes it believable.
          </p>

          <h2>5. Close (45–60s)</h2>
          <p>Clear CTA. Tell the viewer what to do next. Keep it direct.</p>

          <p>
            You don’t need a massive budget to make a great launch video. You
            just need clarity, structure, and tight execution.
          </p>

          <p>
            <strong>Example:</strong> Altrina
          </p>
          <VideoPlayer
            className="rounded-[12px] shadow-xl"
            src="https://storage.googleapis.com/video-drive-8d636.appspot.com/launch-library/videos/1895609930670862809-altrina.mp4?GoogleAccessId=video-downloader%40video-drive-8d636.iam.gserviceaccount.com&Expires=16730294400&Signature=Rjc3gw8Qfj4Q%2FcqIn30heaOvz6jEGrJJ6wB6l7RplaB6qcb%2BY1mZZB%2FMMKKA9WOYsMmVFf99N25o32iHl8Ii6ixds3jiczO8m84Efp8%2BsvmwRkCWilByOmfm44%2FhjIiGpiE2THKqO9iCUfDiloPhQMbugr527s1WmZnn9a6qdwItghK7A3MlmfnWj7uW0QbevgDOMeU3bQPdwqfTiECtBa53FLNh3Qh31YtIpH06R8KgQUMWWOjdSAYmd4ZsU9nfS%2FR6a7FmRbf1CrWm8f1z5K5%2BMUVA5%2FPYObZWTgOkZGp%2BreyOGqJ%2BumxvIg9o9auXv84eR2rh91zgqAOt5NZ9Cg%3D%3D"
          />

          <p>
            Is this video perfect? No. But it clearly communicates the product
            and uses very lightweight production. Anyone could execute this
            format with the guide I just laid out, an iPhone camera, a mic, a
            laptop, and a free editing platform like CapCut.
          </p>

          <h1>Need Help With Your Launch Video?</h1>

          <p>If you’re planning a launch, this is what we do every day.</p>

          <p>
            At Ripple Media, we work with founders to create launch videos that
            actually get attention—from simple, scrappy executions to fully
            produced brand films.
          </p>

          <p>
            Different goals. Different budgets. Same focus: making something
            that works.
          </p>

          <p>
            Whether you need help refining a concept, tightening a script, or
            producing the full video, we can meet you where you’re at.
          </p>

          <h1>Want to See What Actually Works?</h1>

          <p>
            We analyzed 1,000+ startup launch videos and built a curated library
            of the best ones.
          </p>

          <p>
            Organized by format, industry, and style, with breakdowns of what
            works and why.
          </p>

          <p>If you don’t want to guess on your launch:</p>

          <p>
            → <a href="/launch-library">Start here</a>
          </p>
        </div>
      </div>
    </div>
  );
};
