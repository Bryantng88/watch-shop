import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StrapCatalogOptionKindSchema } from '../enums/StrapCatalogOptionKind.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  kind: StrapCatalogOptionKindSchema,
  code: z.string(),
  name: z.string(),
  colorHex: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const StrapCatalogOptionCreateManyInputObjectSchema: z.ZodType<Prisma.StrapCatalogOptionCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.StrapCatalogOptionCreateManyInput>;
export const StrapCatalogOptionCreateManyInputObjectZodSchema = makeSchema();
