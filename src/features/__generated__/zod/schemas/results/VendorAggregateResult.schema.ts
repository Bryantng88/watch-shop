import * as z from 'zod';
export const VendorAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    name: z.number(),
    role: z.number(),
    isAuthorized: z.number(),
    email: z.number(),
    phone: z.number(),
    address: z.number(),
    note: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    bankName: z.number(),
    bankAcc: z.number(),
    acquisitions: z.number(),
    invoice: z.number(),
    services: z.number(),
    Product: z.number(),
    Bank: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    address: z.string().nullable(),
    note: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    bankName: z.string().nullable(),
    bankAcc: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    address: z.string().nullable(),
    note: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    bankName: z.string().nullable(),
    bankAcc: z.string().nullable()
  }).nullable().optional()});