import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueWhereInputObjectSchema as TechnicalIssueWhereInputObjectSchema } from './TechnicalIssueWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => TechnicalIssueWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => TechnicalIssueWhereInputObjectSchema).optional().nullable()
}).strict();
export const TechnicalIssueNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.TechnicalIssueNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueNullableScalarRelationFilter>;
export const TechnicalIssueNullableScalarRelationFilterObjectZodSchema = makeSchema();
