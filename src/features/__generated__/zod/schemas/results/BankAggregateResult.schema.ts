import * as z from 'zod';
export const BankAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    created_at: z.number(),
    bankName: z.number(),
    Vendor: z.number()
  }).optional(),
  _sum: z.object({
    id: z.bigint().nullable()
  }).nullable().optional(),
  _avg: z.object({
    id: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.bigint().nullable(),
    created_at: z.date().nullable(),
    bankName: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.bigint().nullable(),
    created_at: z.date().nullable(),
    bankName: z.string().nullable()
  }).nullable().optional()});