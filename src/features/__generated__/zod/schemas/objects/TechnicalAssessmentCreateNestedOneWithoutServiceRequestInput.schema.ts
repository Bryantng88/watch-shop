import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentCreateWithoutServiceRequestInputObjectSchema as TechnicalAssessmentCreateWithoutServiceRequestInputObjectSchema } from './TechnicalAssessmentCreateWithoutServiceRequestInput.schema';
import { TechnicalAssessmentUncheckedCreateWithoutServiceRequestInputObjectSchema as TechnicalAssessmentUncheckedCreateWithoutServiceRequestInputObjectSchema } from './TechnicalAssessmentUncheckedCreateWithoutServiceRequestInput.schema';
import { TechnicalAssessmentCreateOrConnectWithoutServiceRequestInputObjectSchema as TechnicalAssessmentCreateOrConnectWithoutServiceRequestInputObjectSchema } from './TechnicalAssessmentCreateOrConnectWithoutServiceRequestInput.schema';
import { TechnicalAssessmentWhereUniqueInputObjectSchema as TechnicalAssessmentWhereUniqueInputObjectSchema } from './TechnicalAssessmentWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalAssessmentCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => TechnicalAssessmentUncheckedCreateWithoutServiceRequestInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => TechnicalAssessmentCreateOrConnectWithoutServiceRequestInputObjectSchema).optional(),
  connect: z.lazy(() => TechnicalAssessmentWhereUniqueInputObjectSchema).optional()
}).strict();
export const TechnicalAssessmentCreateNestedOneWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentCreateNestedOneWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentCreateNestedOneWithoutServiceRequestInput>;
export const TechnicalAssessmentCreateNestedOneWithoutServiceRequestInputObjectZodSchema = makeSchema();
