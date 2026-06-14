import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueUncheckedCreateNestedManyWithoutTechnicalDetailCatalogInputObjectSchema as TechnicalIssueUncheckedCreateNestedManyWithoutTechnicalDetailCatalogInputObjectSchema } from './TechnicalIssueUncheckedCreateNestedManyWithoutTechnicalDetailCatalogInput.schema'

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
  technicalIssues: z.lazy(() => TechnicalIssueUncheckedCreateNestedManyWithoutTechnicalDetailCatalogInputObjectSchema).optional()
}).strict();
export const TechnicalDetailCatalogUncheckedCreateWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogUncheckedCreateWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogUncheckedCreateWithoutTaskActionInput>;
export const TechnicalDetailCatalogUncheckedCreateWithoutTaskActionInputObjectZodSchema = makeSchema();
