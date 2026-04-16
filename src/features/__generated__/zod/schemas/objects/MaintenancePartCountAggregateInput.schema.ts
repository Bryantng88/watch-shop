import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  recordId: z.literal(true).optional(),
  variantId: z.literal(true).optional(),
  name: z.literal(true).optional(),
  quantity: z.literal(true).optional(),
  unitCost: z.literal(true).optional(),
  notes: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const MaintenancePartCountAggregateInputObjectSchema: z.ZodType<Prisma.MaintenancePartCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartCountAggregateInputType>;
export const MaintenancePartCountAggregateInputObjectZodSchema = makeSchema();
