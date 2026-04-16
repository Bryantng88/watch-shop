import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema';
import { VendorUpdateWithoutTechnicalAssessmentInputObjectSchema as VendorUpdateWithoutTechnicalAssessmentInputObjectSchema } from './VendorUpdateWithoutTechnicalAssessmentInput.schema';
import { VendorUncheckedUpdateWithoutTechnicalAssessmentInputObjectSchema as VendorUncheckedUpdateWithoutTechnicalAssessmentInputObjectSchema } from './VendorUncheckedUpdateWithoutTechnicalAssessmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => VendorWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => VendorUpdateWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutTechnicalAssessmentInputObjectSchema)])
}).strict();
export const VendorUpdateToOneWithWhereWithoutTechnicalAssessmentInputObjectSchema: z.ZodType<Prisma.VendorUpdateToOneWithWhereWithoutTechnicalAssessmentInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpdateToOneWithWhereWithoutTechnicalAssessmentInput>;
export const VendorUpdateToOneWithWhereWithoutTechnicalAssessmentInputObjectZodSchema = makeSchema();
