import * as z from 'zod';
import type { Prisma } from '@prisma/client';
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
  updatedAt: z.coerce.date().optional(),
  taskAction: z.lazy(() => TaskActionUncheckedCreateNestedManyWithoutTechnicalDetailCatalogInputObjectSchema).optional()
}).strict();
export const TechnicalDetailCatalogUncheckedCreateWithoutTechnicalIssuesInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogUncheckedCreateWithoutTechnicalIssuesInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogUncheckedCreateWithoutTechnicalIssuesInput>;
export const TechnicalDetailCatalogUncheckedCreateWithoutTechnicalIssuesInputObjectZodSchema = makeSchema();
