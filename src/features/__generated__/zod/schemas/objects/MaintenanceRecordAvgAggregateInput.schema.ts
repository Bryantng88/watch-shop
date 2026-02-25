import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  totalCost: z.literal(true).optional(),
  revenueAmount: z.literal(true).optional(),
  paidAmount: z.literal(true).optional()
}).strict();
export const MaintenanceRecordAvgAggregateInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceRecordAvgAggregateInputType>;
export const MaintenanceRecordAvgAggregateInputObjectZodSchema = makeSchema();
