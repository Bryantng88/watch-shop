import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string(),
  name: z.string(),
  appliesTo: z.string().optional(),
  groupKey: z.string().optional(),
  requiresPart: z.boolean().optional(),
  defaultExecutionMode: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  note: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const technicalActionCatalogUncheckedCreateInputObjectSchema: z.ZodType<Prisma.technicalActionCatalogUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalActionCatalogUncheckedCreateInput>;
export const technicalActionCatalogUncheckedCreateInputObjectZodSchema = makeSchema();
