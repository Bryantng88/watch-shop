import * as z from 'zod';
export const WatchContentCreateResultSchema = z.object({
  id: z.string(),
  watchId: z.string(),
  titleOverride: z.string().optional(),
  summary: z.string().optional(),
  hookText: z.string().optional(),
  body: z.string().optional(),
  bulletSpecs: z.array(z.string()),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  aiMetaJson: z.unknown().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  watch: z.unknown()
});