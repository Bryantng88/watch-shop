import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumTechnicalIssueTypeWithAggregatesFilterObjectSchema as EnumTechnicalIssueTypeWithAggregatesFilterObjectSchema } from './EnumTechnicalIssueTypeWithAggregatesFilter.schema';
import { TechnicalIssueTypeSchema } from '../enums/TechnicalIssueType.schema';
import { EnumTechnicalActionModeWithAggregatesFilterObjectSchema as EnumTechnicalActionModeWithAggregatesFilterObjectSchema } from './EnumTechnicalActionModeWithAggregatesFilter.schema';
import { TechnicalActionModeSchema } from '../enums/TechnicalActionMode.schema';
import { DecimalNullableWithAggregatesFilterObjectSchema as DecimalNullableWithAggregatesFilterObjectSchema } from './DecimalNullableWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const technicalissuescalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => TechnicalIssueScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TechnicalIssueScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TechnicalIssueScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TechnicalIssueScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TechnicalIssueScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  assessmentId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  area: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  issueType: z.union([z.lazy(() => EnumTechnicalIssueTypeWithAggregatesFilterObjectSchema), TechnicalIssueTypeSchema]).optional(),
  actionMode: z.union([z.lazy(() => EnumTechnicalActionModeWithAggregatesFilterObjectSchema), TechnicalActionModeSchema]).optional(),
  serviceCatalogId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  supplyCatalogId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  estimatedCost: z.union([z.lazy(() => DecimalNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  sortOrder: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  vendorId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  vendorNameSnap: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  mechanicalPartCatalogId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const TechnicalIssueScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.TechnicalIssueScalarWhereWithAggregatesInput> = technicalissuescalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.TechnicalIssueScalarWhereWithAggregatesInput>;
export const TechnicalIssueScalarWhereWithAggregatesInputObjectZodSchema = technicalissuescalarwherewithaggregatesinputSchema;
