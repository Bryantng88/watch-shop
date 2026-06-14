import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueFindManySchema as TechnicalIssueFindManySchema } from '../findManyTechnicalIssue.schema';
import { TaskActionFindManySchema as TaskActionFindManySchema } from '../findManyTaskAction.schema';
import { TechnicalDetailCatalogCountOutputTypeArgsObjectSchema as TechnicalDetailCatalogCountOutputTypeArgsObjectSchema } from './TechnicalDetailCatalogCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  area: z.boolean().optional(),
  code: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  sortOrder: z.boolean().optional(),
  isActive: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  technicalIssues: z.union([z.boolean(), z.lazy(() => TechnicalIssueFindManySchema)]).optional(),
  taskAction: z.union([z.boolean(), z.lazy(() => TaskActionFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => TechnicalDetailCatalogCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const TechnicalDetailCatalogSelectObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogSelect> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogSelect>;
export const TechnicalDetailCatalogSelectObjectZodSchema = makeSchema();
