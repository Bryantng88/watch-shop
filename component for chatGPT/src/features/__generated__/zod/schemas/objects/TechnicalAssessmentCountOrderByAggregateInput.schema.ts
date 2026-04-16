import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  serviceRequestId: SortOrderSchema.optional(),
  movementKind: SortOrderSchema.optional(),
  preRate: SortOrderSchema.optional(),
  preAmplitude: SortOrderSchema.optional(),
  preBeatError: SortOrderSchema.optional(),
  postRate: SortOrderSchema.optional(),
  postAmplitude: SortOrderSchema.optional(),
  postBeatError: SortOrderSchema.optional(),
  actionMode: SortOrderSchema.optional(),
  vendorId: SortOrderSchema.optional(),
  vendorNameSnap: SortOrderSchema.optional(),
  conclusion: SortOrderSchema.optional(),
  imageFileKey: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  evaluatedById: SortOrderSchema.optional(),
  evaluatedByNameSnap: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  movementStatus: SortOrderSchema.optional(),
  caseStatus: SortOrderSchema.optional(),
  crystalStatus: SortOrderSchema.optional(),
  crownStatus: SortOrderSchema.optional(),
  payloadJson: SortOrderSchema.optional()
}).strict();
export const TechnicalAssessmentCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentCountOrderByAggregateInput>;
export const TechnicalAssessmentCountOrderByAggregateInputObjectZodSchema = makeSchema();
