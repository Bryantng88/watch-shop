import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumAppTagScopeFilterObjectSchema as EnumAppTagScopeFilterObjectSchema } from './EnumAppTagScopeFilter.schema';
import { AppTagScopeSchema } from '../enums/AppTagScope.schema';
import { EnumAppTagOwnerTypeNullableFilterObjectSchema as EnumAppTagOwnerTypeNullableFilterObjectSchema } from './EnumAppTagOwnerTypeNullableFilter.schema';
import { AppTagOwnerTypeSchema } from '../enums/AppTagOwnerType.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { AppTagLinkListRelationFilterObjectSchema as AppTagLinkListRelationFilterObjectSchema } from './AppTagLinkListRelationFilter.schema'

const apptagwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => AppTagWhereInputObjectSchema), z.lazy(() => AppTagWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AppTagWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AppTagWhereInputObjectSchema), z.lazy(() => AppTagWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  slug: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  color: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  scope: z.union([z.lazy(() => EnumAppTagScopeFilterObjectSchema), AppTagScopeSchema]).optional(),
  ownerType: z.union([z.lazy(() => EnumAppTagOwnerTypeNullableFilterObjectSchema), AppTagOwnerTypeSchema]).optional().nullable(),
  ownerId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  links: z.lazy(() => AppTagLinkListRelationFilterObjectSchema).optional()
}).strict();
export const AppTagWhereInputObjectSchema: z.ZodType<Prisma.AppTagWhereInput> = apptagwhereinputSchema as unknown as z.ZodType<Prisma.AppTagWhereInput>;
export const AppTagWhereInputObjectZodSchema = apptagwhereinputSchema;
