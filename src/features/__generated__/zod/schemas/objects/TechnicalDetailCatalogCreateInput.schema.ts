import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateNestedManyWithoutTechnicalDetailCatalogInputObjectSchema as TechnicalIssueCreateNestedManyWithoutTechnicalDetailCatalogInputObjectSchema } from './TechnicalIssueCreateNestedManyWithoutTechnicalDetailCatalogInput.schema';
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
  technicalIssues: z.lazy(() => TechnicalIssueCreateNestedManyWithoutTechnicalDetailCatalogInputObjectSchema),
  taskAction: z.lazy(() => TaskActionCreateNestedManyWithoutTechnicalDetailCatalogInputObjectSchema)
}).strict();
export const TechnicalDetailCatalogCreateInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogCreateInput>;
export const TechnicalDetailCatalogCreateInputObjectZodSchema = makeSchema();
