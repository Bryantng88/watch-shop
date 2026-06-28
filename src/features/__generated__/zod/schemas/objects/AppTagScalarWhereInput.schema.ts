import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumAppTagScopeFilterObjectSchema as EnumAppTagScopeFilterObjectSchema } from './EnumAppTagScopeFilter.schema';
import { AppTagScopeSchema } from '../enums/AppTagScope.schema';
import { EnumAppTagOwnerTypeNullableFilterObjectSchema as EnumAppTagOwnerTypeNullableFilterObjectSchema } from './EnumAppTagOwnerTypeNullableFilter.schema';
import { AppTagOwnerTypeSchema } from '../enums/AppTagOwnerType.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const apptagscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => AppTagScalarWhereInputObjectSchema), z.lazy(() => AppTagScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AppTagScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AppTagScalarWhereInputObjectSchema), z.lazy(() => AppTagScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  slug: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  color: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  scope: z.union([z.lazy(() => EnumAppTagScopeFilterObjectSchema), AppTagScopeSchema]).optional(),
  ownerType: z.union([z.lazy(() => EnumAppTagOwnerTypeNullableFilterObjectSchema), AppTagOwnerTypeSchema]).optional().nullable(),
  ownerId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  workflowTemplateId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const AppTagScalarWhereInputObjectSchema: z.ZodType<Prisma.AppTagScalarWhereInput> = apptagscalarwhereinputSchema as unknown as z.ZodType<Prisma.AppTagScalarWhereInput>;
export const AppTagScalarWhereInputObjectZodSchema = apptagscalarwhereinputSchema;
