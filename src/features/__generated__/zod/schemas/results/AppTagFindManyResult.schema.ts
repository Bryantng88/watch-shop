import * as z from 'zod';
export const AppTagFindManyResultSchema = z.object({
  data: z.array(z.object({
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
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});