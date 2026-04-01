import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorUpdateWithoutTechnicalAssessmentInputObjectSchema as VendorUpdateWithoutTechnicalAssessmentInputObjectSchema } from './VendorUpdateWithoutTechnicalAssessmentInput.schema';
import { VendorUncheckedUpdateWithoutTechnicalAssessmentInputObjectSchema as VendorUncheckedUpdateWithoutTechnicalAssessmentInputObjectSchema } from './VendorUncheckedUpdateWithoutTechnicalAssessmentInput.schema';
import { VendorCreateWithoutTechnicalAssessmentInputObjectSchema as VendorCreateWithoutTechnicalAssessmentInputObjectSchema } from './VendorCreateWithoutTechnicalAssessmentInput.schema';
import { VendorUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema as VendorUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema } from './VendorUncheckedCreateWithoutTechnicalAssessmentInput.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => VendorUpdateWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutTechnicalAssessmentInputObjectSchema)]),
  create: z.union([z.lazy(() => VendorCreateWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema)]),
  where: z.lazy(() => VendorWhereInputObjectSchema).optional()
}).strict();
export const VendorUpsertWithoutTechnicalAssessmentInputObjectSchema: z.ZodType<Prisma.VendorUpsertWithoutTechnicalAssessmentInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpsertWithoutTechnicalAssessmentInput>;
export const VendorUpsertWithoutTechnicalAssessmentInputObjectZodSchema = makeSchema();
