import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutTechnicalAssessmentInputObjectSchema as ServiceRequestCreateWithoutTechnicalAssessmentInputObjectSchema } from './ServiceRequestCreateWithoutTechnicalAssessmentInput.schema';
import { ServiceRequestUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema as ServiceRequestUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutTechnicalAssessmentInput.schema';
import { ServiceRequestCreateOrConnectWithoutTechnicalAssessmentInputObjectSchema as ServiceRequestCreateOrConnectWithoutTechnicalAssessmentInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutTechnicalAssessmentInput.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ServiceRequestCreateOrConnectWithoutTechnicalAssessmentInputObjectSchema).optional(),
  connect: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).optional()
}).strict();
export const ServiceRequestCreateNestedOneWithoutTechnicalAssessmentInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateNestedOneWithoutTechnicalAssessmentInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateNestedOneWithoutTechnicalAssessmentInput>;
export const ServiceRequestCreateNestedOneWithoutTechnicalAssessmentInputObjectZodSchema = makeSchema();
