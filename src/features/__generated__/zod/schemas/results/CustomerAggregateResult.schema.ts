import * as z from 'zod';
export const CustomerAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    name: z.number(),
    email: z.number(),
    phone: z.number(),
    ward: z.number(),
    city: z.number(),
    userId: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    Acquisition: z.number(),
    user: z.number(),
    Invoice: z.number(),
    orders: z.number(),
    ServiceRequest: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    ward: z.string().nullable(),
    city: z.string().nullable(),
    userId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    ward: z.string().nullable(),
    city: z.string().nullable(),
    userId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});