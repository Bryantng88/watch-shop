import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  code: z.boolean().optional(),
  name: z.boolean().optional(),
  appliesTo: z.boolean().optional(),
  partGroup: z.boolean().optional(),
  sortOrder: z.boolean().optional(),
  isActive: z.boolean().optional(),
  note: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const technicalPartCatalogSelectObjectSchema: z.ZodType<Prisma.technicalPartCatalogSelect> = makeSchema() as unknown as z.ZodType<Prisma.technicalPartCatalogSelect>;
export const technicalPartCatalogSelectObjectZodSchema = makeSchema();
