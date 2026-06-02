import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { TechnicalIssueListRelationFilterObjectSchema as TechnicalIssueListRelationFilterObjectSchema } from './TechnicalIssueListRelationFilter.schema'

const technicaldetailcatalogwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TechnicalDetailCatalogWhereInputObjectSchema), z.lazy(() => TechnicalDetailCatalogWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TechnicalDetailCatalogWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TechnicalDetailCatalogWhereInputObjectSchema), z.lazy(() => TechnicalDetailCatalogWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  area: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  isActive: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  technicalIssues: z.lazy(() => TechnicalIssueListRelationFilterObjectSchema).optional()
}).strict();
export const TechnicalDetailCatalogWhereInputObjectSchema: z.ZodType<Prisma.TechnicalDetailCatalogWhereInput> = technicaldetailcatalogwhereinputSchema as unknown as z.ZodType<Prisma.TechnicalDetailCatalogWhereInput>;
export const TechnicalDetailCatalogWhereInputObjectZodSchema = technicaldetailcatalogwhereinputSchema;
