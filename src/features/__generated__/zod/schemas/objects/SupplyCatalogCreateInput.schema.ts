import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateNestedManyWithoutSupplyCatalogInputObjectSchema as TechnicalIssueCreateNestedManyWithoutSupplyCatalogInputObjectSchema } from './TechnicalIssueCreateNestedManyWithoutSupplyCatalogInput.schema';
import { TaskActionCreateNestedManyWithoutSupplyCatalogInputObjectSchema as TaskActionCreateNestedManyWithoutSupplyCatalogInputObjectSchema } from './TaskActionCreateNestedManyWithoutSupplyCatalogInput.schema'

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
  TechnicalIssue: z.lazy(() => TechnicalIssueCreateNestedManyWithoutSupplyCatalogInputObjectSchema),
  taskAction: z.lazy(() => TaskActionCreateNestedManyWithoutSupplyCatalogInputObjectSchema)
}).strict();
export const SupplyCatalogCreateInputObjectSchema: z.ZodType<Prisma.SupplyCatalogCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogCreateInput>;
export const SupplyCatalogCreateInputObjectZodSchema = makeSchema();
