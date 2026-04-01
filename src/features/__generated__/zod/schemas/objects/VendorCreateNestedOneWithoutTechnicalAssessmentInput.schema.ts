import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorCreateWithoutTechnicalAssessmentInputObjectSchema as VendorCreateWithoutTechnicalAssessmentInputObjectSchema } from './VendorCreateWithoutTechnicalAssessmentInput.schema';
import { VendorUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema as VendorUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema } from './VendorUncheckedCreateWithoutTechnicalAssessmentInput.schema';
import { VendorCreateOrConnectWithoutTechnicalAssessmentInputObjectSchema as VendorCreateOrConnectWithoutTechnicalAssessmentInputObjectSchema } from './VendorCreateOrConnectWithoutTechnicalAssessmentInput.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => VendorCreateWithoutTechnicalAssessmentInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutTechnicalAssessmentInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => VendorCreateOrConnectWithoutTechnicalAssessmentInputObjectSchema).optional(),
  connect: z.lazy(() => VendorWhereUniqueInputObjectSchema).optional()
}).strict();
export const VendorCreateNestedOneWithoutTechnicalAssessmentInputObjectSchema: z.ZodType<Prisma.VendorCreateNestedOneWithoutTechnicalAssessmentInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateNestedOneWithoutTechnicalAssessmentInput>;
export const VendorCreateNestedOneWithoutTechnicalAssessmentInputObjectZodSchema = makeSchema();
