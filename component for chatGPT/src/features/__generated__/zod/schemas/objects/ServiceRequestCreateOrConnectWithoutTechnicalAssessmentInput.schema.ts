import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestCreateWithoutTechnicalAssessmentInputObjectSchema as ServiceRequestCreateWithoutTechnicalAssessmentInputObjectSchema } from './ServiceRequestCreateWithoutTechnicalAssessmentInput.schema';
import { ServiceRequestUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema as ServiceRequestUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutTechnicalAssessmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema)])
}).strict();
export const ServiceRequestCreateOrConnectWithoutTechnicalAssessmentInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutTechnicalAssessmentInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateOrConnectWithoutTechnicalAssessmentInput>;
export const ServiceRequestCreateOrConnectWithoutTechnicalAssessmentInputObjectZodSchema = makeSchema();
