import * as z from 'zod';
export const AppTagFindFirstResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  color: z.string().optional(),
  scope: z.unknown(),
  ownerType: z.unknown().optional(),
  ownerId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  links: z.array(z.unknown())
}));