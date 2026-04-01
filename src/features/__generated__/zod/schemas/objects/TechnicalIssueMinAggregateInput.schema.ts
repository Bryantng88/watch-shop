import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  assessmentId: z.literal(true).optional(),
  area: z.literal(true).optional(),
  issueType: z.literal(true).optional(),
  actionMode: z.literal(true).optional(),
  serviceCatalogId: z.literal(true).optional(),
  supplyCatalogId: z.literal(true).optional(),
  note: z.literal(true).optional(),
  estimatedCost: z.literal(true).optional(),
  sortOrder: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const TechnicalIssueMinAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalIssueMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueMinAggregateInputType>;
export const TechnicalIssueMinAggregateInputObjectZodSchema = makeSchema();
