import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema';
import { ServiceRequestUpdateWithoutTechnicalAssessmentInputObjectSchema as ServiceRequestUpdateWithoutTechnicalAssessmentInputObjectSchema } from './ServiceRequestUpdateWithoutTechnicalAssessmentInput.schema';
import { ServiceRequestUncheckedUpdateWithoutTechnicalAssessmentInputObjectSchema as ServiceRequestUncheckedUpdateWithoutTechnicalAssessmentInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutTechnicalAssessmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ServiceRequestUpdateWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutTechnicalAssessmentInputObjectSchema)])
}).strict();
export const ServiceRequestUpdateToOneWithWhereWithoutTechnicalAssessmentInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateToOneWithWhereWithoutTechnicalAssessmentInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateToOneWithWhereWithoutTechnicalAssessmentInput>;
export const ServiceRequestUpdateToOneWithWhereWithoutTechnicalAssessmentInputObjectZodSchema = makeSchema();
