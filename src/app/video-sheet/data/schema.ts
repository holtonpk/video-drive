import {z} from "zod";
import {Timestamp} from "@/lib/utils";
// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

type Timestamp = {
  nanoseconds: number;
  seconds: number;
};

export const videoSchema = z.object({
  videoNumber: z.string(),
  title: z.string(),
  status: z.string(),
  client: z.string(),

  dueDate: z.object({
    nanoseconds: z.number(),
    seconds: z.number(),
  }),
  updatedAt: z.object({
    nanoseconds: z.number(),
    seconds: z.number(),
  }),
});

export type Video = z.infer<typeof videoSchema>;
