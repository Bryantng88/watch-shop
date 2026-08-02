import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const WatchStrapInstallationOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationOrderByRelationAggregateInput>;
export const WatchStrapInstallationOrderByRelationAggregateInputObjectZodSchema = makeSchema();
