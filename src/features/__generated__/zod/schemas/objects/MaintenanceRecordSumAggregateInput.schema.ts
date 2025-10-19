import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  totalCost: z.literal(true).optional(),
  revenueAmount: z.literal(true).optional()
}).strict();
export const MaintenanceRecordSumAggregateInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordSumAggregateInputType>;
export const MaintenanceRecordSumAggregateInputObjectZodSchema = makeSchema();
