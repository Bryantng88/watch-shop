import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentWhereUniqueInputObjectSchema as TechnicalAssessmentWhereUniqueInputObjectSchema } from './TechnicalAssessmentWhereUniqueInput.schema';
import { TechnicalAssessmentCreateWithoutServiceRequestInputObjectSchema as TechnicalAssessmentCreateWithoutServiceRequestInputObjectSchema } from './TechnicalAssessmentCreateWithoutServiceRequestInput.schema';
import { TechnicalAssessmentUncheckedCreateWithoutServiceRequestInputObjectSchema as TechnicalAssessmentUncheckedCreateWithoutServiceRequestInputObjectSchema } from './TechnicalAssessmentUncheckedCreateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalAssessmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TechnicalAssessmentCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => TechnicalAssessmentUncheckedCreateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const TechnicalAssessmentCreateOrConnectWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentCreateOrConnectWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentCreateOrConnectWithoutServiceRequestInput>;
export const TechnicalAssessmentCreateOrConnectWithoutServiceRequestInputObjectZodSchema = makeSchema();
