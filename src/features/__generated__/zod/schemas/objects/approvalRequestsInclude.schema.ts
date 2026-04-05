import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { technicalAssessmentsArgsObjectSchema as technicalAssessmentsArgsObjectSchema } from './technicalAssessmentsArgs.schema'

const makeSchema = () => z.object({
  technicalAssessments: z.union([z.boolean(), z.lazy(() => technicalAssessmentsArgsObjectSchema)]).optional()
}).strict();
export const approvalRequestsIncludeObjectSchema: z.ZodType<Prisma.approvalRequestsInclude> = makeSchema() as unknown as z.ZodType<Prisma.approvalRequestsInclude>;
export const approvalRequestsIncludeObjectZodSchema = makeSchema();
