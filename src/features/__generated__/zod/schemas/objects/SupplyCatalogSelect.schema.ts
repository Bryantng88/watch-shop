import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueFindManySchema as TechnicalIssueFindManySchema } from '../findManyTechnicalIssue.schema';
import { SupplyCatalogCountOutputTypeArgsObjectSchema as SupplyCatalogCountOutputTypeArgsObjectSchema } from './SupplyCatalogCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  code: z.boolean().optional(),
  name: z.boolean().optional(),
  category: z.boolean().optional(),
  unit: z.boolean().optional(),
  defaultCost: z.boolean().optional(),
  note: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  TechnicalIssue: z.union([z.boolean(), z.lazy(() => TechnicalIssueFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => SupplyCatalogCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const SupplyCatalogSelectObjectSchema: z.ZodType<Prisma.SupplyCatalogSelect> = makeSchema() as unknown as z.ZodType<Prisma.SupplyCatalogSelect>;
export const SupplyCatalogSelectObjectZodSchema = makeSchema();
