import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  code: z.boolean().optional(),
  area: z.boolean().optional(),
  label: z.boolean().optional(),
  deductionScore: z.boolean().optional(),
  sortOrder: z.boolean().optional(),
  isActive: z.boolean().optional(),
  note: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const technicalAppearanceIssueCatalogSelectObjectSchema: z.ZodType<Prisma.technicalAppearanceIssueCatalogSelect> = makeSchema() as unknown as z.ZodType<Prisma.technicalAppearanceIssueCatalogSelect>;
export const technicalAppearanceIssueCatalogSelectObjectZodSchema = makeSchema();
