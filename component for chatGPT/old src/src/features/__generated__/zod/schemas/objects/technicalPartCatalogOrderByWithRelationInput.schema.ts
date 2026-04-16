import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  appliesTo: SortOrderSchema.optional(),
  partGroup: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const technicalPartCatalogOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.technicalPartCatalogOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalPartCatalogOrderByWithRelationInput>;
export const technicalPartCatalogOrderByWithRelationInputObjectZodSchema = makeSchema();
