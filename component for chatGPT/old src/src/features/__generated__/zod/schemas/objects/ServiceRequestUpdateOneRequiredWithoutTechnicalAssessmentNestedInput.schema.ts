import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCreateWithoutTechnicalAssessmentInputObjectSchema as ServiceRequestCreateWithoutTechnicalAssessmentInputObjectSchema } from './ServiceRequestCreateWithoutTechnicalAssessmentInput.schema';
import { ServiceRequestUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema as ServiceRequestUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema } from './ServiceRequestUncheckedCreateWithoutTechnicalAssessmentInput.schema';
import { ServiceRequestCreateOrConnectWithoutTechnicalAssessmentInputObjectSchema as ServiceRequestCreateOrConnectWithoutTechnicalAssessmentInputObjectSchema } from './ServiceRequestCreateOrConnectWithoutTechnicalAssessmentInput.schema';
import { ServiceRequestUpsertWithoutTechnicalAssessmentInputObjectSchema as ServiceRequestUpsertWithoutTechnicalAssessmentInputObjectSchema } from './ServiceRequestUpsertWithoutTechnicalAssessmentInput.schema';
import { ServiceRequestWhereUniqueInputObjectSchema as ServiceRequestWhereUniqueInputObjectSchema } from './ServiceRequestWhereUniqueInput.schema';
import { ServiceRequestUpdateToOneWithWhereWithoutTechnicalAssessmentInputObjectSchema as ServiceRequestUpdateToOneWithWhereWithoutTechnicalAssessmentInputObjectSchema } from './ServiceRequestUpdateToOneWithWhereWithoutTechnicalAssessmentInput.schema';
import { ServiceRequestUpdateWithoutTechnicalAssessmentInputObjectSchema as ServiceRequestUpdateWithoutTechnicalAssessmentInputObjectSchema } from './ServiceRequestUpdateWithoutTechnicalAssessmentInput.schema';
import { ServiceRequestUncheckedUpdateWithoutTechnicalAssessmentInputObjectSchema as ServiceRequestUncheckedUpdateWithoutTechnicalAssessmentInputObjectSchema } from './ServiceRequestUncheckedUpdateWithoutTechnicalAssessmentInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ServiceRequestCreateWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => ServiceRequestUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ServiceRequestCreateOrConnectWithoutTechnicalAssessmentInputObjectSchema).optional(),
  upsert: z.lazy(() => ServiceRequestUpsertWithoutTechnicalAssessmentInputObjectSchema).optional(),
  connect: z.lazy(() => ServiceRequestWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ServiceRequestUpdateToOneWithWhereWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => ServiceRequestUpdateWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => ServiceRequestUncheckedUpdateWithoutTechnicalAssessmentInputObjectSchema)]).optional()
}).strict();
export const ServiceRequestUpdateOneRequiredWithoutTechnicalAssessmentNestedInputObjectSchema: z.ZodType<Prisma.ServiceRequestUpdateOneRequiredWithoutTechnicalAssessmentNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestUpdateOneRequiredWithoutTechnicalAssessmentNestedInput>;
export const ServiceRequestUpdateOneRequiredWithoutTechnicalAssessmentNestedInputObjectZodSchema = makeSchema();
