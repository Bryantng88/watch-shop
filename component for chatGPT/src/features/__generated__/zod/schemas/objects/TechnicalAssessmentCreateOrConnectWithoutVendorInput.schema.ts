import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentWhereUniqueInputObjectSchema as TechnicalAssessmentWhereUniqueInputObjectSchema } from './TechnicalAssessmentWhereUniqueInput.schema';
import { TechnicalAssessmentCreateWithoutVendorInputObjectSchema as TechnicalAssessmentCreateWithoutVendorInputObjectSchema } from './TechnicalAssessmentCreateWithoutVendorInput.schema';
import { TechnicalAssessmentUncheckedCreateWithoutVendorInputObjectSchema as TechnicalAssessmentUncheckedCreateWithoutVendorInputObjectSchema } from './TechnicalAssessmentUncheckedCreateWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => TechnicalAssessmentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => TechnicalAssessmentCreateWithoutVendorInputObjectSchema), z.lazy(() => TechnicalAssessmentUncheckedCreateWithoutVendorInputObjectSchema)])
}).strict();
export const TechnicalAssessmentCreateOrConnectWithoutVendorInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentCreateOrConnectWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentCreateOrConnectWithoutVendorInput>;
export const TechnicalAssessmentCreateOrConnectWithoutVendorInputObjectZodSchema = makeSchema();
