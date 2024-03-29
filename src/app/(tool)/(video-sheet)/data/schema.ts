import {z} from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.

export const videoSchema = z.object({
  videoNumber: z.string(),
  title: z.string(),
  status: z.string(),
  clientId: z.string(),

  dueDate: z.object({
    nanoseconds: z.number(),
    seconds: z.number(),
  }),
  updatedAt: z.object({
    nanoseconds: z.number(),
    seconds: z.number(),
  }),
  videoURL: z.string().optional(),
});

export type Video = z.infer<typeof videoSchema>;
