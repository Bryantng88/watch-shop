import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestArgsObjectSchema as ServiceRequestArgsObjectSchema } from './ServiceRequestArgs.schema';
import { VendorArgsObjectSchema as VendorArgsObjectSchema } from './VendorArgs.schema';
import { TechnicalIssueFindManySchema as TechnicalIssueFindManySchema } from '../findManyTechnicalIssue.schema';
import { TechnicalAssessmentCountOutputTypeArgsObjectSchema as TechnicalAssessmentCountOutputTypeArgsObjectSchema } from './TechnicalAssessmentCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  ServiceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestArgsObjectSchema)]).optional(),
  Vendor: z.union([z.boolean(), z.lazy(() => VendorArgsObjectSchema)]).optional(),
  TechnicalIssue: z.union([z.boolean(), z.lazy(() => TechnicalIssueFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => TechnicalAssessmentCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const TechnicalAssessmentIncludeObjectSchema: z.ZodType<Prisma.TechnicalAssessmentInclude> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentInclude>;
export const TechnicalAssessmentIncludeObjectZodSchema = makeSchema();
