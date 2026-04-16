import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumImageRoleFilterObjectSchema as EnumImageRoleFilterObjectSchema } from './EnumImageRoleFilter.schema';
import { ImageRoleSchema } from '../enums/ImageRole.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { IntNullableFilterObjectSchema as IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const productimagescalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ProductImageScalarWhereInputObjectSchema), z.lazy(() => ProductImageScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ProductImageScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ProductImageScalarWhereInputObjectSchema), z.lazy(() => ProductImageScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  fileKey: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  role: z.union([z.lazy(() => EnumImageRoleFilterObjectSchema), ImageRoleSchema]).optional(),
  alt: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  width: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  height: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  mime: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  sizeBytes: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  dominantHex: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  contentHash: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const ProductImageScalarWhereInputObjectSchema: z.ZodType<Prisma.ProductImageScalarWhereInput> = productimagescalarwhereinputSchema as unknown as z.ZodType<Prisma.ProductImageScalarWhereInput>;
export const ProductImageScalarWhereInputObjectZodSchema = productimagescalarwhereinputSchema;
