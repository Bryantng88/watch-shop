import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { approvalRequestsArgsObjectSchema as approvalRequestsArgsObjectSchema } from './approvalRequestsArgs.schema';
import { technicalAssessmentsArgsObjectSchema as technicalAssessmentsArgsObjectSchema } from './technicalAssessmentsArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  serviceRequestId: z.boolean().optional(),
  technicalAssessmentId: z.boolean().optional(),
  approvalRequestId: z.boolean().optional(),
  sourceType: z.boolean().optional(),
  category: z.boolean().optional(),
  action: z.boolean().optional(),
  execution: z.boolean().optional(),
  vendorId: z.boolean().optional(),
  partId: z.boolean().optional(),
  cost: z.boolean().optional(),
  note: z.boolean().optional(),
  status: z.boolean().optional(),
  autoApproved: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  approvalRequests: z.union([z.boolean(), z.lazy(() => approvalRequestsArgsObjectSchema)]).optional(),
  technicalAssessments: z.union([z.boolean(), z.lazy(() => technicalAssessmentsArgsObjectSchema)]).optional()
}).strict();
export const maintenanceLogsSelectObjectSchema: z.ZodType<Prisma.maintenanceLogsSelect> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsSelect>;
export const maintenanceLogsSelectObjectZodSchema = makeSchema();
