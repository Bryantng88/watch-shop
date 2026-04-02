import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { technicalAssessmentsArgsObjectSchema as technicalAssessmentsArgsObjectSchema } from './technicalAssessmentsArgs.schema';
import { maintenanceLogsFindManySchema as maintenanceLogsFindManySchema } from '../findManymaintenanceLogs.schema';
import { ApprovalRequestsCountOutputTypeArgsObjectSchema as ApprovalRequestsCountOutputTypeArgsObjectSchema } from './ApprovalRequestsCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  technicalAssessments: z.union([z.boolean(), z.lazy(() => technicalAssessmentsArgsObjectSchema)]).optional(),
  maintenanceLogs: z.union([z.boolean(), z.lazy(() => maintenanceLogsFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ApprovalRequestsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const approvalRequestsIncludeObjectSchema: z.ZodType<Prisma.approvalRequestsInclude> = makeSchema() as unknown as z.ZodType<Prisma.approvalRequestsInclude>;
export const approvalRequestsIncludeObjectZodSchema = makeSchema();
