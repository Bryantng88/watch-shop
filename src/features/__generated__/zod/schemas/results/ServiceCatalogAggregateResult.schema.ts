import * as z from 'zod';
export const ServiceCatalogAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    code: z.number(),
    name: z.number(),
    description: z.number(),
    defaultPrice: z.number(),
    durationMin: z.number(),
    isActive: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    maintenanceRecordId: z.number(),
    MaintenanceRecord: z.number()
  }).optional(),
  _sum: z.object({
    defaultPrice: z.number().nullable(),
    durationMin: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    defaultPrice: z.number().nullable(),
    durationMin: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    code: z.string().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    defaultPrice: z.number().nullable(),
    durationMin: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    maintenanceRecordId: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    code: z.string().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    defaultPrice: z.number().nullable(),
    durationMin: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    maintenanceRecordId: z.string().nullable()
  }).nullable().optional()});