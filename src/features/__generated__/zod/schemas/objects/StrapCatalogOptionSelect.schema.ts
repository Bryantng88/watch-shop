import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  kind: z.boolean().optional(),
  code: z.boolean().optional(),
  name: z.boolean().optional(),
  colorHex: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional()
}).strict();
export const StrapCatalogOptionSelectObjectSchema: z.ZodType<Prisma.StrapCatalogOptionSelect> = makeSchema() as unknown as z.ZodType<Prisma.StrapCatalogOptionSelect>;
export const StrapCatalogOptionSelectObjectZodSchema = makeSchema();
