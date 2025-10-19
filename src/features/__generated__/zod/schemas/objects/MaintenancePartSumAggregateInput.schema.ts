import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  quantity: z.literal(true).optional(),
  unitCost: z.literal(true).optional()
}).strict();
export const MaintenancePartSumAggregateInputObjectSchema: z.ZodType<Prisma.MaintenancePartSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartSumAggregateInputType>;
export const MaintenancePartSumAggregateInputObjectZodSchema = makeSchema();
