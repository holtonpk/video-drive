import Link from "next/link";
// import {Post} from "@prisma/client";
import {Icons} from "@/components/icons";
import {formatTimeDifference} from "@/lib/utils";
// import {Skeleton} from "@/components/ui/skeleton";
import {PostOperations} from "./post-operations";
import {BlogPost} from "@/config/data";
interface PostItemProps {
  post: Pick<BlogPost, "id" | "title" | "published" | "createdAt">;
}

export function PostItem({post}: PostItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/blog-manage/${post.id}`}
          className="font-semibold hover:underline text-primary"
        >
          {post.title}
        </Link>
        <div>
          <div className="flex flex-row gap-2 items-center">
            {post.published ? (
              <span className="text-foreground  flex items-center gap-1 text-sm text-green-600">
                <Icons.checkCircle className="h-3 w-3  " />
                Published
              </span>
            ) : (
              <span className=" flex items-center gap-1 text-sm text-blue-600">
                <Icons.circle className="h-3 w-3 " />
                Draft
              </span>
            )}

            <div className="h-4 w-[1px] bg-border" />
            <p className="text-sm text-muted-foreground">
              {formatTimeDifference(post.createdAt)}
            </p>
          </div>
        </div>
      </div>
      <PostOperations post={{id: post.id, title: post.title}} />
    </div>
  );
}

PostItem.Skeleton = function PostItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        {/* <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" /> */}
      </div>
    </div>
  );
};
