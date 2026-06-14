import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TaskActionCreateNestedManyWithoutTechnicalDetailCatalogInputObjectSchema as TaskActionCreateNestedManyWithoutTechnicalDetailCatalogInputObjectSchema } from './TaskActionCreateNestedManyWithoutTechnicalDetailCatalogInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  area: z.string(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  taskAction: z.lazy(() => TaskActionCreateNestedManyWithoutTechnicalDetailCatalogInputObjectSchema).optional()
}).strict();
export const TechnicalDetailCatalogCreateWithoutTechnicalIssuesInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogCreateWithoutTechnicalIssuesInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogCreateWithoutTechnicalIssuesInput>;
export const TechnicalDetailCatalogCreateWithoutTechnicalIssuesInputObjectZodSchema = makeSchema();
