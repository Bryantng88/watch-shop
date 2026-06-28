import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumAppTagScopeWithAggregatesFilterObjectSchema as EnumAppTagScopeWithAggregatesFilterObjectSchema } from './EnumAppTagScopeWithAggregatesFilter.schema';
import { AppTagScopeSchema } from '../enums/AppTagScope.schema';
import { EnumAppTagOwnerTypeNullableWithAggregatesFilterObjectSchema as EnumAppTagOwnerTypeNullableWithAggregatesFilterObjectSchema } from './EnumAppTagOwnerTypeNullableWithAggregatesFilter.schema';
import { AppTagOwnerTypeSchema } from '../enums/AppTagOwnerType.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const apptagscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => AppTagScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AppTagScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AppTagScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AppTagScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AppTagScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  slug: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  color: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  scope: z.union([z.lazy(() => EnumAppTagScopeWithAggregatesFilterObjectSchema), AppTagScopeSchema]).optional(),
  ownerType: z.union([z.lazy(() => EnumAppTagOwnerTypeNullableWithAggregatesFilterObjectSchema), AppTagOwnerTypeSchema]).optional().nullable(),
  ownerId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  workflowTemplateId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const AppTagScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.AppTagScalarWhereWithAggregatesInput> = apptagscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.AppTagScalarWhereWithAggregatesInput>;
export const AppTagScalarWhereWithAggregatesInputObjectZodSchema = apptagscalarwherewithaggregatesinputSchema;
