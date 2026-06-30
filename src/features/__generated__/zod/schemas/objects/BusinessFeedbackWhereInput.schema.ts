import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const businessfeedbackwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => BusinessFeedbackWhereInputObjectSchema), z.lazy(() => BusinessFeedbackWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => BusinessFeedbackWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => BusinessFeedbackWhereInputObjectSchema), z.lazy(() => BusinessFeedbackWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  targetType: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  targetId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  eventKey: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  actorUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  message: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  visibility: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  metadataJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const BusinessFeedbackWhereInputObjectSchema: z.ZodType<Prisma.BusinessFeedbackWhereInput> = businessfeedbackwhereinputSchema as unknown as z.ZodType<Prisma.BusinessFeedbackWhereInput>;
export const BusinessFeedbackWhereInputObjectZodSchema = businessfeedbackwhereinputSchema;
