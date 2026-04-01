import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumMechanicalPartGroupFilterObjectSchema as EnumMechanicalPartGroupFilterObjectSchema } from './EnumMechanicalPartGroupFilter.schema';
import { MechanicalPartGroupSchema } from '../enums/MechanicalPartGroup.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { TechnicalIssueListRelationFilterObjectSchema as TechnicalIssueListRelationFilterObjectSchema } from './TechnicalIssueListRelationFilter.schema'

const mechanicalpartcatalogwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => MechanicalPartCatalogWhereInputObjectSchema), z.lazy(() => MechanicalPartCatalogWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MechanicalPartCatalogWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MechanicalPartCatalogWhereInputObjectSchema), z.lazy(() => MechanicalPartCatalogWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  group: z.union([z.lazy(() => EnumMechanicalPartGroupFilterObjectSchema), MechanicalPartGroupSchema]).optional(),
  defaultCost: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  isActive: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  TechnicalIssue: z.lazy(() => TechnicalIssueListRelationFilterObjectSchema).optional()
}).strict();
export const MechanicalPartCatalogWhereInputObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogWhereInput> = mechanicalpartcatalogwhereinputSchema as unknown as z.ZodType<Prisma.MechanicalPartCatalogWhereInput>;
export const MechanicalPartCatalogWhereInputObjectZodSchema = mechanicalpartcatalogwhereinputSchema;
