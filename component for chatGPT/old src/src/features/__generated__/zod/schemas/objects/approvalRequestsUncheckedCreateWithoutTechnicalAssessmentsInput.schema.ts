import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  type: z.string(),
  sourceModule: z.string().optional().nullable(),
  serviceRequestId: z.string().optional().nullable(),
  title: z.string(),
  summary: z.string().optional().nullable(),
  status: z.string().optional(),
  autoApproved: z.boolean().optional(),
  payloadJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  reviewNote: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const approvalRequestsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema: z.ZodType<Prisma.approvalRequestsUncheckedCreateWithoutTechnicalAssessmentsInput> = makeSchema() as unknown as z.ZodType<Prisma.approvalRequestsUncheckedCreateWithoutTechnicalAssessmentsInput>;
export const approvalRequestsUncheckedCreateWithoutTechnicalAssessmentsInputObjectZodSchema = makeSchema();
