import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MechanicalPartGroupSchema } from '../enums/MechanicalPartGroup.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string(),
  name: z.string(),
  group: MechanicalPartGroupSchema.optional(),
  defaultCost: z.number().optional().nullable(),
  note: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const MechanicalPartCatalogCreateWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogCreateWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.MechanicalPartCatalogCreateWithoutTechnicalIssueInput>;
export const MechanicalPartCatalogCreateWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
