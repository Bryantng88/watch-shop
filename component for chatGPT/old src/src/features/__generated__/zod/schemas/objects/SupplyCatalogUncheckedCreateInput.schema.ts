import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueUncheckedCreateNestedManyWithoutSupplyCatalogInputObjectSchema as TechnicalIssueUncheckedCreateNestedManyWithoutSupplyCatalogInputObjectSchema } from './TechnicalIssueUncheckedCreateNestedManyWithoutSupplyCatalogInput.schema'

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
  updatedAt: z.coerce.date().optional(),
  TechnicalIssue: z.lazy(() => TechnicalIssueUncheckedCreateNestedManyWithoutSupplyCatalogInputObjectSchema)
}).strict();
export const SupplyCatalogUncheckedCreateInputObjectSchema: z.ZodType<Prisma.SupplyCatalogUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogUncheckedCreateInput>;
export const SupplyCatalogUncheckedCreateInputObjectZodSchema = makeSchema();
