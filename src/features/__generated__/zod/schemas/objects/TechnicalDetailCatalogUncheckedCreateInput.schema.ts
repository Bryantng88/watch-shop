import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueUncheckedCreateNestedManyWithoutTechnicalDetailCatalogInputObjectSchema as TechnicalIssueUncheckedCreateNestedManyWithoutTechnicalDetailCatalogInputObjectSchema } from './TechnicalIssueUncheckedCreateNestedManyWithoutTechnicalDetailCatalogInput.schema';
import { TaskActionUncheckedCreateNestedManyWithoutTechnicalDetailCatalogInputObjectSchema as TaskActionUncheckedCreateNestedManyWithoutTechnicalDetailCatalogInputObjectSchema } from './TaskActionUncheckedCreateNestedManyWithoutTechnicalDetailCatalogInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  area: z.string(),
  code: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  technicalIssues: z.lazy(() => TechnicalIssueUncheckedCreateNestedManyWithoutTechnicalDetailCatalogInputObjectSchema),
  taskAction: z.lazy(() => TaskActionUncheckedCreateNestedManyWithoutTechnicalDetailCatalogInputObjectSchema)
}).strict();
export const TechnicalDetailCatalogUncheckedCreateInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogUncheckedCreateInput>;
export const TechnicalDetailCatalogUncheckedCreateInputObjectZodSchema = makeSchema();
