import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestArgsObjectSchema as ServiceRequestArgsObjectSchema } from './ServiceRequestArgs.schema';
import { VendorArgsObjectSchema as VendorArgsObjectSchema } from './VendorArgs.schema';
import { TechnicalIssueFindManySchema as TechnicalIssueFindManySchema } from '../findManyTechnicalIssue.schema';
import { TechnicalAssessmentCountOutputTypeArgsObjectSchema as TechnicalAssessmentCountOutputTypeArgsObjectSchema } from './TechnicalAssessmentCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  serviceRequestId: z.boolean().optional(),
  movementKind: z.boolean().optional(),
  preRate: z.boolean().optional(),
  preAmplitude: z.boolean().optional(),
  preBeatError: z.boolean().optional(),
  postRate: z.boolean().optional(),
  postAmplitude: z.boolean().optional(),
  postBeatError: z.boolean().optional(),
  actionMode: z.boolean().optional(),
  vendorId: z.boolean().optional(),
  vendorNameSnap: z.boolean().optional(),
  conclusion: z.boolean().optional(),
  imageFileKey: z.boolean().optional(),
  status: z.boolean().optional(),
  evaluatedById: z.boolean().optional(),
  evaluatedByNameSnap: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  movementStatus: z.boolean().optional(),
  caseStatus: z.boolean().optional(),
  crystalStatus: z.boolean().optional(),
  crownStatus: z.boolean().optional(),
  payloadJson: z.boolean().optional(),
  ServiceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestArgsObjectSchema)]).optional(),
  Vendor: z.union([z.boolean(), z.lazy(() => VendorArgsObjectSchema)]).optional(),
  TechnicalIssue: z.union([z.boolean(), z.lazy(() => TechnicalIssueFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => TechnicalAssessmentCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const TechnicalAssessmentSelectObjectSchema: z.ZodType<Prisma.TechnicalAssessmentSelect> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentSelect>;
export const TechnicalAssessmentSelectObjectZodSchema = makeSchema();
