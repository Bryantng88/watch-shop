import * as z from 'zod';
export const BankFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.bigint(),
  created_at: z.date(),
  bankName: z.string(),
  Vendor: z.array(z.unknown())
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