import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string(),
  area: z.string(),
  label: z.string(),
  deductionScore: z.number().int().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  note: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const technicalAppearanceIssueCatalogUncheckedCreateInputObjectSchema: z.ZodType<Prisma.technicalAppearanceIssueCatalogUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalAppearanceIssueCatalogUncheckedCreateInput>;
export const technicalAppearanceIssueCatalogUncheckedCreateInputObjectZodSchema = makeSchema();
