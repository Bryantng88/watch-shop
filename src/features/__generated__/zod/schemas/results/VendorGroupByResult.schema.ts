import * as z from 'zod';
export const VendorGroupByResultSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
  isAuthorized: z.boolean(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
  note: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
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
    acquisitions: z.number(),
    invoice: z.number(),
    services: z.number(),
    Product: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    address: z.string().nullable(),
    note: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    address: z.string().nullable(),
    note: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));