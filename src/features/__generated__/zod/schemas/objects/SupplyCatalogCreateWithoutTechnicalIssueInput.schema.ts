import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  category: z.string(),
  unit: z.string().optional().nullable(),
  defaultCost: z.number().optional().nullable(),
  note: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const SupplyCatalogCreateWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.SupplyCatalogCreateWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogCreateWithoutTechnicalIssueInput>;
export const SupplyCatalogCreateWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
