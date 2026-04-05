import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ServiceRequestOrderByWithRelationInputObjectSchema as ServiceRequestOrderByWithRelationInputObjectSchema } from './ServiceRequestOrderByWithRelationInput.schema';
import { VendorOrderByWithRelationInputObjectSchema as VendorOrderByWithRelationInputObjectSchema } from './VendorOrderByWithRelationInput.schema';
import { TechnicalIssueOrderByRelationAggregateInputObjectSchema as TechnicalIssueOrderByRelationAggregateInputObjectSchema } from './TechnicalIssueOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  serviceRequestId: SortOrderSchema.optional(),
  movementKind: SortOrderSchema.optional(),
  preRate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  preAmplitude: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  preBeatError: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  postRate: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  postAmplitude: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  postBeatError: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  actionMode: SortOrderSchema.optional(),
  vendorId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  vendorNameSnap: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  conclusion: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  imageFileKey: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  evaluatedById: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  evaluatedByNameSnap: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  movementStatus: SortOrderSchema.optional(),
  caseStatus: SortOrderSchema.optional(),
  crystalStatus: SortOrderSchema.optional(),
  crownStatus: SortOrderSchema.optional(),
  payloadJson: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestOrderByWithRelationInputObjectSchema).optional(),
  Vendor: z.lazy(() => VendorOrderByWithRelationInputObjectSchema).optional(),
  TechnicalIssue: z.lazy(() => TechnicalIssueOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const TechnicalAssessmentOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentOrderByWithRelationInput>;
export const TechnicalAssessmentOrderByWithRelationInputObjectZodSchema = makeSchema();
