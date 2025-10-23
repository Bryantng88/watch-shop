import * as z from 'zod';
export const AcquisitionGroupByResultSchema = z.array(z.object({
  id: z.string(),
  vendorId: z.string(),
  customerId: z.string(),
  acquiredAt: z.date(),
  cost: z.number(),
  currency: z.string(),
  payoutStatus: z.string(),
  refNo: z.string(),
  notes: z.string(),
  condition: z.string(),
  warrantyUntil: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    vendorId: z.number(),
    customerId: z.number(),
    type: z.number(),
    acquiredAt: z.number(),
    cost: z.number(),
    currency: z.number(),
    payoutStatus: z.number(),
    accquisitionStt: z.number(),
    refNo: z.number(),
    notes: z.number(),
    condition: z.number(),
    warrantyUntil: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    customer: z.number(),
    vendor: z.number(),
    AcquisitionItem: z.number(),
    Invoice: z.number()
  }).optional(),
  _sum: z.object({
    cost: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    cost: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    vendorId: z.string().nullable(),
    customerId: z.string().nullable(),
    acquiredAt: z.date().nullable(),
    cost: z.number().nullable(),
    currency: z.string().nullable(),
    payoutStatus: z.string().nullable(),
    refNo: z.string().nullable(),
    notes: z.string().nullable(),
    condition: z.string().nullable(),
    warrantyUntil: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    vendorId: z.string().nullable(),
    customerId: z.string().nullable(),
    acquiredAt: z.date().nullable(),
    cost: z.number().nullable(),
    currency: z.string().nullable(),
    payoutStatus: z.string().nullable(),
    refNo: z.string().nullable(),
    notes: z.string().nullable(),
    condition: z.string().nullable(),
    warrantyUntil: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));