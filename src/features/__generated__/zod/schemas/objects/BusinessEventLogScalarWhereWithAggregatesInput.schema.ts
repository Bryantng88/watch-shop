import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const businesseventlogscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => BusinessEventLogScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => BusinessEventLogScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => BusinessEventLogScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => BusinessEventLogScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => BusinessEventLogScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  eventKey: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  targetType: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  targetId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  actorUserId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  metadataJson: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const BusinessEventLogScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.BusinessEventLogScalarWhereWithAggregatesInput> = businesseventlogscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.BusinessEventLogScalarWhereWithAggregatesInput>;
export const BusinessEventLogScalarWhereWithAggregatesInputObjectZodSchema = businesseventlogscalarwherewithaggregatesinputSchema;
