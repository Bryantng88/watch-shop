import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  quantity: z.literal(true).optional(),
  unitCost: z.literal(true).optional()
}).strict();
export const MaintenancePartAvgAggregateInputObjectSchema: z.ZodType<Prisma.MaintenancePartAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartAvgAggregateInputType>;
export const MaintenancePartAvgAggregateInputObjectZodSchema = makeSchema();
