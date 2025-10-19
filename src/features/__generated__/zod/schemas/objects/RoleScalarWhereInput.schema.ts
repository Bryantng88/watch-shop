import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema'

const rolescalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => RoleScalarWhereInputObjectSchema), z.lazy(() => RoleScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => RoleScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => RoleScalarWhereInputObjectSchema), z.lazy(() => RoleScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const RoleScalarWhereInputObjectSchema: z.ZodType<Prisma.RoleScalarWhereInput> = rolescalarwhereinputSchema as unknown as z.ZodType<Prisma.RoleScalarWhereInput>;
export const RoleScalarWhereInputObjectZodSchema = rolescalarwhereinputSchema;
