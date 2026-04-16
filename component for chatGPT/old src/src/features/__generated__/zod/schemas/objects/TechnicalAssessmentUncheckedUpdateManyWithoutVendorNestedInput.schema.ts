import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalAssessmentCreateWithoutVendorInputObjectSchema as TechnicalAssessmentCreateWithoutVendorInputObjectSchema } from './TechnicalAssessmentCreateWithoutVendorInput.schema';
import { TechnicalAssessmentUncheckedCreateWithoutVendorInputObjectSchema as TechnicalAssessmentUncheckedCreateWithoutVendorInputObjectSchema } from './TechnicalAssessmentUncheckedCreateWithoutVendorInput.schema';
import { TechnicalAssessmentCreateOrConnectWithoutVendorInputObjectSchema as TechnicalAssessmentCreateOrConnectWithoutVendorInputObjectSchema } from './TechnicalAssessmentCreateOrConnectWithoutVendorInput.schema';
import { TechnicalAssessmentUpsertWithWhereUniqueWithoutVendorInputObjectSchema as TechnicalAssessmentUpsertWithWhereUniqueWithoutVendorInputObjectSchema } from './TechnicalAssessmentUpsertWithWhereUniqueWithoutVendorInput.schema';
import { TechnicalAssessmentCreateManyVendorInputEnvelopeObjectSchema as TechnicalAssessmentCreateManyVendorInputEnvelopeObjectSchema } from './TechnicalAssessmentCreateManyVendorInputEnvelope.schema';
import { TechnicalAssessmentWhereUniqueInputObjectSchema as TechnicalAssessmentWhereUniqueInputObjectSchema } from './TechnicalAssessmentWhereUniqueInput.schema';
import { TechnicalAssessmentUpdateWithWhereUniqueWithoutVendorInputObjectSchema as TechnicalAssessmentUpdateWithWhereUniqueWithoutVendorInputObjectSchema } from './TechnicalAssessmentUpdateWithWhereUniqueWithoutVendorInput.schema';
import { TechnicalAssessmentUpdateManyWithWhereWithoutVendorInputObjectSchema as TechnicalAssessmentUpdateManyWithWhereWithoutVendorInputObjectSchema } from './TechnicalAssessmentUpdateManyWithWhereWithoutVendorInput.schema';
import { TechnicalAssessmentScalarWhereInputObjectSchema as TechnicalAssessmentScalarWhereInputObjectSchema } from './TechnicalAssessmentScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => TechnicalAssessmentCreateWithoutVendorInputObjectSchema), z.lazy(() => TechnicalAssessmentCreateWithoutVendorInputObjectSchema).array(), z.lazy(() => TechnicalAssessmentUncheckedCreateWithoutVendorInputObjectSchema), z.lazy(() => TechnicalAssessmentUncheckedCreateWithoutVendorInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TechnicalAssessmentCreateOrConnectWithoutVendorInputObjectSchema), z.lazy(() => TechnicalAssessmentCreateOrConnectWithoutVendorInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TechnicalAssessmentUpsertWithWhereUniqueWithoutVendorInputObjectSchema), z.lazy(() => TechnicalAssessmentUpsertWithWhereUniqueWithoutVendorInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => TechnicalAssessmentCreateManyVendorInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => TechnicalAssessmentWhereUniqueInputObjectSchema), z.lazy(() => TechnicalAssessmentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TechnicalAssessmentWhereUniqueInputObjectSchema), z.lazy(() => TechnicalAssessmentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TechnicalAssessmentWhereUniqueInputObjectSchema), z.lazy(() => TechnicalAssessmentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TechnicalAssessmentWhereUniqueInputObjectSchema), z.lazy(() => TechnicalAssessmentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => TechnicalAssessmentUpdateWithWhereUniqueWithoutVendorInputObjectSchema), z.lazy(() => TechnicalAssessmentUpdateWithWhereUniqueWithoutVendorInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TechnicalAssessmentUpdateManyWithWhereWithoutVendorInputObjectSchema), z.lazy(() => TechnicalAssessmentUpdateManyWithWhereWithoutVendorInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TechnicalAssessmentScalarWhereInputObjectSchema), z.lazy(() => TechnicalAssessmentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const TechnicalAssessmentUncheckedUpdateManyWithoutVendorNestedInputObjectSchema: z.ZodType<Prisma.TechnicalAssessmentUncheckedUpdateManyWithoutVendorNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalAssessmentUncheckedUpdateManyWithoutVendorNestedInput>;
export const TechnicalAssessmentUncheckedUpdateManyWithoutVendorNestedInputObjectZodSchema = makeSchema();
