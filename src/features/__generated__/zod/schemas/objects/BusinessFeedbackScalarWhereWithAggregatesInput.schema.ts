import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const businessfeedbackscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => BusinessFeedbackScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => BusinessFeedbackScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => BusinessFeedbackScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => BusinessFeedbackScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => BusinessFeedbackScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  targetType: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  targetId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  eventKey: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  actorUserId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  message: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  visibility: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  metadataJson: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const BusinessFeedbackScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.BusinessFeedbackScalarWhereWithAggregatesInput> = businessfeedbackscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.BusinessFeedbackScalarWhereWithAggregatesInput>;
export const BusinessFeedbackScalarWhereWithAggregatesInputObjectZodSchema = businessfeedbackscalarwherewithaggregatesinputSchema;
