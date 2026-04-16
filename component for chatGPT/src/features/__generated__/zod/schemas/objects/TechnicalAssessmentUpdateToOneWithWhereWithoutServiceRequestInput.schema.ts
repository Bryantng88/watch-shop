import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentWhereInputObjectSchema as TechnicalAssessmentWhereInputObjectSchema } from './TechnicalAssessmentWhereInput.schema';
import { TechnicalAssessmentUpdateWithoutServiceRequestInputObjectSchema as TechnicalAssessmentUpdateWithoutServiceRequestInputObjectSchema } from './TechnicalAssessmentUpdateWithoutServiceRequestInput.schema';
import { TechnicalAssessmentUncheckedUpdateWithoutServiceRequestInputObjectSchema as TechnicalAssessmentUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './TechnicalAssessmentUncheckedUpdateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalAssessmentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => TechnicalAssessmentUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => TechnicalAssessmentUncheckedUpdateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const TechnicalAssessmentUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentUpdateToOneWithWhereWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentUpdateToOneWithWhereWithoutServiceRequestInput>;
export const TechnicalAssessmentUpdateToOneWithWhereWithoutServiceRequestInputObjectZodSchema = makeSchema();
