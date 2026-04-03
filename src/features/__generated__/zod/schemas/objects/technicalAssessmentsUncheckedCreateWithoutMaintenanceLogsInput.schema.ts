import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { approvalRequestsUncheckedCreateNestedManyWithoutTechnicalAssessmentsInputObjectSchema as approvalRequestsUncheckedCreateNestedManyWithoutTechnicalAssessmentsInputObjectSchema } from './approvalRequestsUncheckedCreateNestedManyWithoutTechnicalAssessmentsInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  serviceRequestId: z.string(),
  machineType: z.string().optional().nullable(),
  movementStatus: z.string().optional().nullable(),
  beforeRate: z.string().optional().nullable(),
  beforeAmp: z.string().optional().nullable(),
  beforeErr: z.string().optional().nullable(),
  afterRate: z.string().optional().nullable(),
  afterAmp: z.string().optional().nullable(),
  afterErr: z.string().optional().nullable(),
  appearanceScore: z.number().int().optional(),
  caseScore: z.number().int().optional(),
  glassScore: z.number().int().optional(),
  dialScore: z.number().int().optional(),
  caseIssues: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  glassIssues: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  dialIssues: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  caseManualDeduction: z.number().int().optional(),
  glassManualDeduction: z.number().int().optional(),
  dialManualDeduction: z.number().int().optional(),
  caseNote: z.string().optional().nullable(),
  glassNote: z.string().optional().nullable(),
  dialNote: z.string().optional().nullable(),
  crownStatus: z.string().optional().nullable(),
  crownAction: z.string().optional().nullable(),
  crownExecution: z.string().optional().nullable(),
  crownVendorId: z.string().optional().nullable(),
  crownPartId: z.string().optional().nullable(),
  crownCost: z.number().int().optional(),
  crownNote: z.string().optional().nullable(),
  movementCost: z.number().int().optional(),
  crownCostTotal: z.number().int().optional(),
  cosmeticProposalCost: z.number().int().optional(),
  totalCost: z.number().int().optional(),
  conclusion: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  approvalRequests: z.lazy(() => approvalRequestsUncheckedCreateNestedManyWithoutTechnicalAssessmentsInputObjectSchema).optional()
}).strict();
export const technicalAssessmentsUncheckedCreateWithoutMaintenanceLogsInputObjectSchema: z.ZodType<Prisma.technicalAssessmentsUncheckedCreateWithoutMaintenanceLogsInput> = makeSchema() as unknown as z.ZodType<Prisma.technicalAssessmentsUncheckedCreateWithoutMaintenanceLogsInput>;
export const technicalAssessmentsUncheckedCreateWithoutMaintenanceLogsInputObjectZodSchema = makeSchema();
