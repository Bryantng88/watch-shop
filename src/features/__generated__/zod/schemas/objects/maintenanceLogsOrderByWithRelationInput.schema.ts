import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { approvalRequestsOrderByWithRelationInputObjectSchema as approvalRequestsOrderByWithRelationInputObjectSchema } from './approvalRequestsOrderByWithRelationInput.schema';
import { technicalAssessmentsOrderByWithRelationInputObjectSchema as technicalAssessmentsOrderByWithRelationInputObjectSchema } from './technicalAssessmentsOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  serviceRequestId: SortOrderSchema.optional(),
  technicalAssessmentId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  approvalRequestId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sourceType: SortOrderSchema.optional(),
  category: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  action: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  execution: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  vendorId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  partId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  cost: SortOrderSchema.optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  status: SortOrderSchema.optional(),
  autoApproved: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  approvalRequests: z.lazy(() => approvalRequestsOrderByWithRelationInputObjectSchema).optional(),
  technicalAssessments: z.lazy(() => technicalAssessmentsOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const maintenanceLogsOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.maintenanceLogsOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsOrderByWithRelationInput>;
export const maintenanceLogsOrderByWithRelationInputObjectZodSchema = makeSchema();
