import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereInputObjectSchema as TechnicalIssueWhereInputObjectSchema } from './TechnicalIssueWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => TechnicalIssueWhereInputObjectSchema).optional(),
  some: z.lazy(() => TechnicalIssueWhereInputObjectSchema).optional(),
  none: z.lazy(() => TechnicalIssueWhereInputObjectSchema).optional()
}).strict();
export const TechnicalIssueListRelationFilterObjectSchema: z.ZodType<Prisma.TechnicalIssueListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueListRelationFilter>;
export const TechnicalIssueListRelationFilterObjectZodSchema = makeSchema();
