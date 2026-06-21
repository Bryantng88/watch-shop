import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueFindManySchema as TechnicalIssueFindManySchema } from '../findManyTechnicalIssue.schema';
import { MechanicalPartCatalogCountOutputTypeArgsObjectSchema as MechanicalPartCatalogCountOutputTypeArgsObjectSchema } from './MechanicalPartCatalogCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  code: z.boolean().optional(),
  name: z.boolean().optional(),
  group: z.boolean().optional(),
  defaultCost: z.boolean().optional(),
  note: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  TechnicalIssue: z.union([z.boolean(), z.lazy(() => TechnicalIssueFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => MechanicalPartCatalogCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const MechanicalPartCatalogSelectObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogSelect> = makeSchema() as unknown as z.ZodType<Prisma.MechanicalPartCatalogSelect>;
export const MechanicalPartCatalogSelectObjectZodSchema = makeSchema();
