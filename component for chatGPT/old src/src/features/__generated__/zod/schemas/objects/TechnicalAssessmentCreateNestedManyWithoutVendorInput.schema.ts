import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentCreateWithoutVendorInputObjectSchema as TechnicalAssessmentCreateWithoutVendorInputObjectSchema } from './TechnicalAssessmentCreateWithoutVendorInput.schema';
import { TechnicalAssessmentUncheckedCreateWithoutVendorInputObjectSchema as TechnicalAssessmentUncheckedCreateWithoutVendorInputObjectSchema } from './TechnicalAssessmentUncheckedCreateWithoutVendorInput.schema';
import { TechnicalAssessmentCreateOrConnectWithoutVendorInputObjectSchema as TechnicalAssessmentCreateOrConnectWithoutVendorInputObjectSchema } from './TechnicalAssessmentCreateOrConnectWithoutVendorInput.schema';
import { TechnicalAssessmentCreateManyVendorInputEnvelopeObjectSchema as TechnicalAssessmentCreateManyVendorInputEnvelopeObjectSchema } from './TechnicalAssessmentCreateManyVendorInputEnvelope.schema';
import { TechnicalAssessmentWhereUniqueInputObjectSchema as TechnicalAssessmentWhereUniqueInputObjectSchema } from './TechnicalAssessmentWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalAssessmentCreateWithoutVendorInputObjectSchema), z.lazy(() => TechnicalAssessmentCreateWithoutVendorInputObjectSchema).array(), z.lazy(() => TechnicalAssessmentUncheckedCreateWithoutVendorInputObjectSchema), z.lazy(() => TechnicalAssessmentUncheckedCreateWithoutVendorInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TechnicalAssessmentCreateOrConnectWithoutVendorInputObjectSchema), z.lazy(() => TechnicalAssessmentCreateOrConnectWithoutVendorInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TechnicalAssessmentCreateManyVendorInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => TechnicalAssessmentWhereUniqueInputObjectSchema), z.lazy(() => TechnicalAssessmentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const TechnicalAssessmentCreateNestedManyWithoutVendorInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentCreateNestedManyWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentCreateNestedManyWithoutVendorInput>;
export const TechnicalAssessmentCreateNestedManyWithoutVendorInputObjectZodSchema = makeSchema();
