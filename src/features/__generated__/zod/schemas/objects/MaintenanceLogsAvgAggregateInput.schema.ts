import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  cost: z.literal(true).optional()
}).strict();
export const MaintenanceLogsAvgAggregateInputObjectSchema: z.ZodType<Prisma.MaintenanceLogsAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MaintenanceLogsAvgAggregateInputType>;
export const MaintenanceLogsAvgAggregateInputObjectZodSchema = makeSchema();
