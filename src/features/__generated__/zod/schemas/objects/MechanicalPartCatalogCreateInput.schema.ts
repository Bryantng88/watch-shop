import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MechanicalPartGroupSchema } from '../enums/MechanicalPartGroup.schema';
import { TechnicalIssueCreateNestedManyWithoutMechanicalPartCatalogInputObjectSchema as TechnicalIssueCreateNestedManyWithoutMechanicalPartCatalogInputObjectSchema } from './TechnicalIssueCreateNestedManyWithoutMechanicalPartCatalogInput.schema'

const makeSchema = () => z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  group: MechanicalPartGroupSchema.optional(),
  defaultCost: z.number().optional().nullable(),
  note: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  TechnicalIssue: z.lazy(() => TechnicalIssueCreateNestedManyWithoutMechanicalPartCatalogInputObjectSchema)
}).strict();
export const MechanicalPartCatalogCreateInputObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.MechanicalPartCatalogCreateInput>;
export const MechanicalPartCatalogCreateInputObjectZodSchema = makeSchema();
