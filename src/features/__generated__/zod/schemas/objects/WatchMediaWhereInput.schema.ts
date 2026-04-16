import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumImageRoleNullableFilterObjectSchema as EnumImageRoleNullableFilterObjectSchema } from './EnumImageRoleNullableFilter.schema';
import { ImageRoleSchema } from '../enums/ImageRole.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { IntNullableFilterObjectSchema as IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { WatchScalarRelationFilterObjectSchema as WatchScalarRelationFilterObjectSchema } from './WatchScalarRelationFilter.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema'

const watchmediawhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WatchMediaWhereInputObjectSchema), z.lazy(() => WatchMediaWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WatchMediaWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WatchMediaWhereInputObjectSchema), z.lazy(() => WatchMediaWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  watchId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  legacyProductImageId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  key: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  url: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  type: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  role: z.union([z.lazy(() => EnumImageRoleNullableFilterObjectSchema), ImageRoleSchema]).optional().nullable(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  alt: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  width: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  height: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  mime: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  sizeBytes: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  dominantHex: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  contentHash: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  watch: z.union([z.lazy(() => WatchScalarRelationFilterObjectSchema), z.lazy(() => WatchWhereInputObjectSchema)]).optional()
}).strict();
export const WatchMediaWhereInputObjectSchema: z.ZodType<Prisma.WatchMediaWhereInput> = watchmediawhereinputSchema as unknown as z.ZodType<Prisma.WatchMediaWhereInput>;
export const WatchMediaWhereInputObjectZodSchema = watchmediawhereinputSchema;
