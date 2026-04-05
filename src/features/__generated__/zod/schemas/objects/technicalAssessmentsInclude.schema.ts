import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { approvalRequestsFindManySchema as approvalRequestsFindManySchema } from '../findManyapprovalRequests.schema';
import { TechnicalAssessmentsCountOutputTypeArgsObjectSchema as TechnicalAssessmentsCountOutputTypeArgsObjectSchema } from './TechnicalAssessmentsCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  approvalRequests: z.union([z.boolean(), z.lazy(() => approvalRequestsFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => TechnicalAssessmentsCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const technicalAssessmentsIncludeObjectSchema: z.ZodType<Prisma.technicalAssessmentsInclude> = makeSchema() as unknown as z.ZodType<Prisma.technicalAssessmentsInclude>;
export const technicalAssessmentsIncludeObjectZodSchema = makeSchema();
