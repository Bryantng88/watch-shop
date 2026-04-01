import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentWhereUniqueInputObjectSchema as TechnicalAssessmentWhereUniqueInputObjectSchema } from './TechnicalAssessmentWhereUniqueInput.schema';
import { TechnicalAssessmentUpdateWithoutVendorInputObjectSchema as TechnicalAssessmentUpdateWithoutVendorInputObjectSchema } from './TechnicalAssessmentUpdateWithoutVendorInput.schema';
import { TechnicalAssessmentUncheckedUpdateWithoutVendorInputObjectSchema as TechnicalAssessmentUncheckedUpdateWithoutVendorInputObjectSchema } from './TechnicalAssessmentUncheckedUpdateWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalAssessmentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => TechnicalAssessmentUpdateWithoutVendorInputObjectSchema), z.lazy(() => TechnicalAssessmentUncheckedUpdateWithoutVendorInputObjectSchema)])
}).strict();
export const TechnicalAssessmentUpdateWithWhereUniqueWithoutVendorInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentUpdateWithWhereUniqueWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentUpdateWithWhereUniqueWithoutVendorInput>;
export const TechnicalAssessmentUpdateWithWhereUniqueWithoutVendorInputObjectZodSchema = makeSchema();
