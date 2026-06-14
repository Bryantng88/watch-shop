import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCreateNestedManyWithoutTechnicalDetailCatalogInputObjectSchema as TechnicalIssueCreateNestedManyWithoutTechnicalDetailCatalogInputObjectSchema } from './TechnicalIssueCreateNestedManyWithoutTechnicalDetailCatalogInput.schema'

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
  technicalIssues: z.lazy(() => TechnicalIssueCreateNestedManyWithoutTechnicalDetailCatalogInputObjectSchema).optional()
}).strict();
export const TechnicalDetailCatalogCreateWithoutTaskActionInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogCreateWithoutTaskActionInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogCreateWithoutTaskActionInput>;
export const TechnicalDetailCatalogCreateWithoutTaskActionInputObjectZodSchema = makeSchema();
