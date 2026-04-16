import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentWhereUniqueInputObjectSchema as TechnicalAssessmentWhereUniqueInputObjectSchema } from './TechnicalAssessmentWhereUniqueInput.schema';
import { TechnicalAssessmentUpdateWithoutVendorInputObjectSchema as TechnicalAssessmentUpdateWithoutVendorInputObjectSchema } from './TechnicalAssessmentUpdateWithoutVendorInput.schema';
import { TechnicalAssessmentUncheckedUpdateWithoutVendorInputObjectSchema as TechnicalAssessmentUncheckedUpdateWithoutVendorInputObjectSchema } from './TechnicalAssessmentUncheckedUpdateWithoutVendorInput.schema';
import { TechnicalAssessmentCreateWithoutVendorInputObjectSchema as TechnicalAssessmentCreateWithoutVendorInputObjectSchema } from './TechnicalAssessmentCreateWithoutVendorInput.schema';
import { TechnicalAssessmentUncheckedCreateWithoutVendorInputObjectSchema as TechnicalAssessmentUncheckedCreateWithoutVendorInputObjectSchema } from './TechnicalAssessmentUncheckedCreateWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalAssessmentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => TechnicalAssessmentUpdateWithoutVendorInputObjectSchema), z.lazy(() => TechnicalAssessmentUncheckedUpdateWithoutVendorInputObjectSchema)]),
  create: z.union([z.lazy(() => TechnicalAssessmentCreateWithoutVendorInputObjectSchema), z.lazy(() => TechnicalAssessmentUncheckedCreateWithoutVendorInputObjectSchema)])
}).strict();
export const TechnicalAssessmentUpsertWithWhereUniqueWithoutVendorInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentUpsertWithWhereUniqueWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentUpsertWithWhereUniqueWithoutVendorInput>;
export const TechnicalAssessmentUpsertWithWhereUniqueWithoutVendorInputObjectZodSchema = makeSchema();
