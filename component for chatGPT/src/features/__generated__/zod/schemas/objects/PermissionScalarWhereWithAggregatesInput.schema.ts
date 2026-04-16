import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema'

const permissionscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => PermissionScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => PermissionScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => PermissionScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => PermissionScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => PermissionScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const PermissionScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.PermissionScalarWhereWithAggregatesInput> = permissionscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.PermissionScalarWhereWithAggregatesInput>;
export const PermissionScalarWhereWithAggregatesInputObjectZodSchema = permissionscalarwherewithaggregatesinputSchema;
