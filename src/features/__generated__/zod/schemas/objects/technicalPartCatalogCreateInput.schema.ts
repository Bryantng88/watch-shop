import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string(),
  name: z.string(),
  appliesTo: z.string().optional(),
  partGroup: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  note: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const technicalPartCatalogCreateInputObjectSchema: z.ZodType<Prisma.technicalPartCatalogCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalPartCatalogCreateInput>;
export const technicalPartCatalogCreateInputObjectZodSchema = makeSchema();
