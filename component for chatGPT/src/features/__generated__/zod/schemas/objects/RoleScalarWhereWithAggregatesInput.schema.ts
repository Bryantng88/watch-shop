import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema'

const rolescalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => RoleScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => RoleScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RoleScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RoleScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => RoleScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const RoleScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.RoleScalarWhereWithAggregatesInput> = rolescalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.RoleScalarWhereWithAggregatesInput>;
export const RoleScalarWhereWithAggregatesInputObjectZodSchema = rolescalarwherewithaggregatesinputSchema;
