import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  appliesTo: SortOrderSchema.optional(),
  groupKey: SortOrderSchema.optional(),
  requiresPart: SortOrderSchema.optional(),
  defaultExecutionMode: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sortOrder: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const technicalActionCatalogOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.technicalActionCatalogOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalActionCatalogOrderByWithRelationInput>;
export const technicalActionCatalogOrderByWithRelationInputObjectZodSchema = makeSchema();
