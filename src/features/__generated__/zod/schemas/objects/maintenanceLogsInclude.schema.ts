import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { approvalRequestsArgsObjectSchema as approvalRequestsArgsObjectSchema } from './approvalRequestsArgs.schema';
import { technicalAssessmentsArgsObjectSchema as technicalAssessmentsArgsObjectSchema } from './technicalAssessmentsArgs.schema'

const makeSchema = () => z.object({
  approvalRequests: z.union([z.boolean(), z.lazy(() => approvalRequestsArgsObjectSchema)]).optional(),
  technicalAssessments: z.union([z.boolean(), z.lazy(() => technicalAssessmentsArgsObjectSchema)]).optional()
}).strict();
export const maintenanceLogsIncludeObjectSchema: z.ZodType<Prisma.maintenanceLogsInclude> = makeSchema() as unknown as z.ZodType<Prisma.maintenanceLogsInclude>;
export const maintenanceLogsIncludeObjectZodSchema = makeSchema();
