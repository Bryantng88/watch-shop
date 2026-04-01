import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema';
import { VendorCreateWithoutTechnicalAssessmentInputObjectSchema as VendorCreateWithoutTechnicalAssessmentInputObjectSchema } from './VendorCreateWithoutTechnicalAssessmentInput.schema';
import { VendorUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema as VendorUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema } from './VendorUncheckedCreateWithoutTechnicalAssessmentInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => VendorWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => VendorCreateWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema)])
}).strict();
export const VendorCreateOrConnectWithoutTechnicalAssessmentInputObjectSchema: z.ZodType<Prisma.VendorCreateOrConnectWithoutTechnicalAssessmentInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateOrConnectWithoutTechnicalAssessmentInput>;
export const VendorCreateOrConnectWithoutTechnicalAssessmentInputObjectZodSchema = makeSchema();
