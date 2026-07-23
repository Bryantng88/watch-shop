import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumMediaOperationTypeWithAggregatesFilterObjectSchema as EnumMediaOperationTypeWithAggregatesFilterObjectSchema } from './EnumMediaOperationTypeWithAggregatesFilter.schema';
import { MediaOperationTypeSchema } from '../enums/MediaOperationType.schema';
import { EnumMediaOperationStatusWithAggregatesFilterObjectSchema as EnumMediaOperationStatusWithAggregatesFilterObjectSchema } from './EnumMediaOperationStatusWithAggregatesFilter.schema';
import { MediaOperationStatusSchema } from '../enums/MediaOperationStatus.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema as DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const mediaoperationscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => MediaOperationScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => MediaOperationScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MediaOperationScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MediaOperationScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => MediaOperationScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  idempotencyKey: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  mediaObjectId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  type: z.union([z.lazy(() => EnumMediaOperationTypeWithAggregatesFilterObjectSchema), MediaOperationTypeSchema]).optional(),
  status: z.union([z.lazy(() => EnumMediaOperationStatusWithAggregatesFilterObjectSchema), MediaOperationStatusSchema]).optional(),
  sourceKey: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  destinationKey: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  attempts: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  lastError: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  requestedByUserId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  startedAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  completedAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const MediaOperationScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.MediaOperationScalarWhereWithAggregatesInput> = mediaoperationscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.MediaOperationScalarWhereWithAggregatesInput>;
export const MediaOperationScalarWhereWithAggregatesInputObjectZodSchema = mediaoperationscalarwherewithaggregatesinputSchema;
