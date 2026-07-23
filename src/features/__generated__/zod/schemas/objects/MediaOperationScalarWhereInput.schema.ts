import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumMediaOperationTypeFilterObjectSchema as EnumMediaOperationTypeFilterObjectSchema } from './EnumMediaOperationTypeFilter.schema';
import { MediaOperationTypeSchema } from '../enums/MediaOperationType.schema';
import { EnumMediaOperationStatusFilterObjectSchema as EnumMediaOperationStatusFilterObjectSchema } from './EnumMediaOperationStatusFilter.schema';
import { MediaOperationStatusSchema } from '../enums/MediaOperationStatus.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const mediaoperationscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => MediaOperationScalarWhereInputObjectSchema), z.lazy(() => MediaOperationScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MediaOperationScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MediaOperationScalarWhereInputObjectSchema), z.lazy(() => MediaOperationScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  idempotencyKey: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  mediaObjectId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  type: z.union([z.lazy(() => EnumMediaOperationTypeFilterObjectSchema), MediaOperationTypeSchema]).optional(),
  status: z.union([z.lazy(() => EnumMediaOperationStatusFilterObjectSchema), MediaOperationStatusSchema]).optional(),
  sourceKey: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  destinationKey: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  attempts: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  lastError: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  requestedByUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  startedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  completedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const MediaOperationScalarWhereInputObjectSchema: z.ZodType<Prisma.MediaOperationScalarWhereInput> = mediaoperationscalarwhereinputSchema as unknown as z.ZodType<Prisma.MediaOperationScalarWhereInput>;
export const MediaOperationScalarWhereInputObjectZodSchema = mediaoperationscalarwhereinputSchema;
