import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentUpdateWithoutServiceRequestInputObjectSchema as TechnicalAssessmentUpdateWithoutServiceRequestInputObjectSchema } from './TechnicalAssessmentUpdateWithoutServiceRequestInput.schema';
import { TechnicalAssessmentUncheckedUpdateWithoutServiceRequestInputObjectSchema as TechnicalAssessmentUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './TechnicalAssessmentUncheckedUpdateWithoutServiceRequestInput.schema';
import { TechnicalAssessmentCreateWithoutServiceRequestInputObjectSchema as TechnicalAssessmentCreateWithoutServiceRequestInputObjectSchema } from './TechnicalAssessmentCreateWithoutServiceRequestInput.schema';
import { TechnicalAssessmentUncheckedCreateWithoutServiceRequestInputObjectSchema as TechnicalAssessmentUncheckedCreateWithoutServiceRequestInputObjectSchema } from './TechnicalAssessmentUncheckedCreateWithoutServiceRequestInput.schema';
import { TechnicalAssessmentWhereInputObjectSchema as TechnicalAssessmentWhereInputObjectSchema } from './TechnicalAssessmentWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => TechnicalAssessmentUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => TechnicalAssessmentUncheckedUpdateWithoutServiceRequestInputObjectSchema)]),
  create: z.union([z.lazy(() => TechnicalAssessmentCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => TechnicalAssessmentUncheckedCreateWithoutServiceRequestInputObjectSchema)]),
  where: z.lazy(() => TechnicalAssessmentWhereInputObjectSchema).optional()
}).strict();
export const TechnicalAssessmentUpsertWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentUpsertWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentUpsertWithoutServiceRequestInput>;
export const TechnicalAssessmentUpsertWithoutServiceRequestInputObjectZodSchema = makeSchema();
