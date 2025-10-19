import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const MaintenancePartOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.MaintenancePartOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartOrderByRelationAggregateInput>;
export const MaintenancePartOrderByRelationAggregateInputObjectZodSchema = makeSchema();
