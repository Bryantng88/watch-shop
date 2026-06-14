import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateNestedManyWithoutSupplyCatalogInputObjectSchema as TechnicalIssueCreateNestedManyWithoutSupplyCatalogInputObjectSchema } from './TechnicalIssueCreateNestedManyWithoutSupplyCatalogInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
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
  TechnicalIssue: z.lazy(() => TechnicalIssueCreateNestedManyWithoutSupplyCatalogInputObjectSchema).optional()
}).strict();
export const SupplyCatalogCreateWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.SupplyCatalogCreateWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogCreateWithoutTaskActionInput>;
export const SupplyCatalogCreateWithoutTaskActionInputObjectZodSchema = makeSchema();
