import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  serviceRequestId: SortOrderSchema.optional(),
  movementKind: SortOrderSchema.optional(),
  runningOk: SortOrderSchema.optional(),
  batteryWeak: SortOrderSchema.optional(),
  batteryIssueBattery: SortOrderSchema.optional(),
  batteryIssueIC: SortOrderSchema.optional(),
  batteryIssueCoil: SortOrderSchema.optional(),
  preRate: SortOrderSchema.optional(),
  preAmplitude: SortOrderSchema.optional(),
  preBeatError: SortOrderSchema.optional(),
  postRate: SortOrderSchema.optional(),
  postAmplitude: SortOrderSchema.optional(),
  postBeatError: SortOrderSchema.optional(),
  actionMode: SortOrderSchema.optional(),
  vendorId: SortOrderSchema.optional(),
  vendorNameSnap: SortOrderSchema.optional(),
  diagnosis: SortOrderSchema.optional(),
  conclusion: SortOrderSchema.optional(),
  imageFileKey: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  evaluatedById: SortOrderSchema.optional(),
  evaluatedByNameSnap: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const TechnicalAssessmentMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentMinOrderByAggregateInput>;
export const TechnicalAssessmentMinOrderByAggregateInputObjectZodSchema = makeSchema();
