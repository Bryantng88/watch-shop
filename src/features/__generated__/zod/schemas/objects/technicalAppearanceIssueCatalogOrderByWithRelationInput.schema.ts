import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  area: SortOrderSchema.optional(),
  label: SortOrderSchema.optional(),
  deductionScore: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const technicalAppearanceIssueCatalogOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.technicalAppearanceIssueCatalogOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalAppearanceIssueCatalogOrderByWithRelationInput>;
export const technicalAppearanceIssueCatalogOrderByWithRelationInputObjectZodSchema = makeSchema();
