import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  kind: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  colorHex: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isActive: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const StrapCatalogOptionOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.StrapCatalogOptionOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapCatalogOptionOrderByWithRelationInput>;
export const StrapCatalogOptionOrderByWithRelationInputObjectZodSchema = makeSchema();
