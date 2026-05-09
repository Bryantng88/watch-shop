import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { IntNullableFilterObjectSchema as IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { EnumMediaAssetStatusFilterObjectSchema as EnumMediaAssetStatusFilterObjectSchema } from './EnumMediaAssetStatusFilter.schema';
import { MediaAssetStatusSchema } from '../enums/MediaAssetStatus.schema';
import { EnumImageRoleNullableFilterObjectSchema as EnumImageRoleNullableFilterObjectSchema } from './EnumImageRoleNullableFilter.schema';
import { ImageRoleSchema } from '../enums/ImageRole.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const mediaassetwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => MediaAssetWhereInputObjectSchema), z.lazy(() => MediaAssetWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MediaAssetWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MediaAssetWhereInputObjectSchema), z.lazy(() => MediaAssetWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  key: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  parentPrefix: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  fileName: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ext: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  sizeBytes: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  etag: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  lastModified: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  profile: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => EnumMediaAssetStatusFilterObjectSchema), MediaAssetStatusSchema]).optional(),
  productId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  acquisitionId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  role: z.union([z.lazy(() => EnumImageRoleNullableFilterObjectSchema), ImageRoleSchema]).optional().nullable(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  isMissing: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  missingAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  lastSeenAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  movedFromKey: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const MediaAssetWhereInputObjectSchema: z.ZodType<Prisma.MediaAssetWhereInput> = mediaassetwhereinputSchema as unknown as z.ZodType<Prisma.MediaAssetWhereInput>;
export const MediaAssetWhereInputObjectZodSchema = mediaassetwhereinputSchema;
