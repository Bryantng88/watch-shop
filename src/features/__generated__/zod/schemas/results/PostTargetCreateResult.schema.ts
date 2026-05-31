import * as z from 'zod';
export const PostTargetCreateResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  platform: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  products: z.array(z.unknown())
});