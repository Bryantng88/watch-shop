import * as z from 'zod';
export const AppTagLinkCreateResultSchema = z.object({
  id: z.string(),
  tagId: z.string(),
  targetType: z.unknown(),
  targetId: z.string(),
  createdAt: z.date(),
  tag: z.unknown()
});