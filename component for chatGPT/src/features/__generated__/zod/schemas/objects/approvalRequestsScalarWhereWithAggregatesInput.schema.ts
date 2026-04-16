import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidWithAggregatesFilterObjectSchema as UuidWithAggregatesFilterObjectSchema } from './UuidWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { UuidNullableWithAggregatesFilterObjectSchema as UuidNullableWithAggregatesFilterObjectSchema } from './UuidNullableWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const approvalrequestsscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => approvalRequestsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => approvalRequestsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => approvalRequestsScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => approvalRequestsScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => approvalRequestsScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  sourceModule: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  serviceRequestId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  technicalAssessmentId: z.union([z.lazy(() => UuidNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  title: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  summary: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  autoApproved: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  payloadJson: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  reviewNote: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const approvalRequestsScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.approvalRequestsScalarWhereWithAggregatesInput> = approvalrequestsscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.approvalRequestsScalarWhereWithAggregatesInput>;
export const approvalRequestsScalarWhereWithAggregatesInputObjectZodSchema = approvalrequestsscalarwherewithaggregatesinputSchema;
