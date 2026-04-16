import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestUpdateWithoutTechnicalAssessmentInputObjectSchema as ServiceRequestUpdateWithoutTechnicalAssessmentInputObjectSchema } from './ServiceRequestUpdateWithoutTechnicalAssessmentInput.schema';
import { ServiceRequestUncheckedUpdateWithoutTechnicalAssessmentInputObjectSchema as ServiceRequestUncheckedUpdateWithoutTechnicalAssessmentInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutTechnicalAssessmentInput.schema';
import { ServiceRequestCreateWithoutTechnicalAssessmentInputObjectSchema as ServiceRequestCreateWithoutTechnicalAssessmentInputObjectSchema } from './ServiceRequestCreateWithoutTechnicalAssessmentInput.schema';
import { ServiceRequestUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema as ServiceRequestUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutTechnicalAssessmentInput.schema';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ServiceRequestUpdateWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutTechnicalAssessmentInputObjectSchema)]),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema)]),
  where: z.lazy(() => ServiceRequestWhereInputObjectSchema).optional()
}).strict();
export const ServiceRequestUpsertWithoutTechnicalAssessmentInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpsertWithoutTechnicalAssessmentInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpsertWithoutTechnicalAssessmentInput>;
export const ServiceRequestUpsertWithoutTechnicalAssessmentInputObjectZodSchema = makeSchema();
