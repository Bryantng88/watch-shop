import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { approvalRequestsCreateWithoutTechnicalAssessmentsInputObjectSchema as approvalRequestsCreateWithoutTechnicalAssessmentsInputObjectSchema } from './approvalRequestsCreateWithoutTechnicalAssessmentsInput.schema';
import { approvalRequestsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema as approvalRequestsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema } from './approvalRequestsUncheckedCreateWithoutTechnicalAssessmentsInput.schema';
import { approvalRequestsCreateOrConnectWithoutTechnicalAssessmentsInputObjectSchema as approvalRequestsCreateOrConnectWithoutTechnicalAssessmentsInputObjectSchema } from './approvalRequestsCreateOrConnectWithoutTechnicalAssessmentsInput.schema';
import { approvalRequestsUpsertWithWhereUniqueWithoutTechnicalAssessmentsInputObjectSchema as approvalRequestsUpsertWithWhereUniqueWithoutTechnicalAssessmentsInputObjectSchema } from './approvalRequestsUpsertWithWhereUniqueWithoutTechnicalAssessmentsInput.schema';
import { approvalRequestsCreateManyTechnicalAssessmentsInputEnvelopeObjectSchema as approvalRequestsCreateManyTechnicalAssessmentsInputEnvelopeObjectSchema } from './approvalRequestsCreateManyTechnicalAssessmentsInputEnvelope.schema';
import { approvalRequestsWhereUniqueInputObjectSchema as approvalRequestsWhereUniqueInputObjectSchema } from './approvalRequestsWhereUniqueInput.schema';
import { approvalRequestsUpdateWithWhereUniqueWithoutTechnicalAssessmentsInputObjectSchema as approvalRequestsUpdateWithWhereUniqueWithoutTechnicalAssessmentsInputObjectSchema } from './approvalRequestsUpdateWithWhereUniqueWithoutTechnicalAssessmentsInput.schema';
import { approvalRequestsUpdateManyWithWhereWithoutTechnicalAssessmentsInputObjectSchema as approvalRequestsUpdateManyWithWhereWithoutTechnicalAssessmentsInputObjectSchema } from './approvalRequestsUpdateManyWithWhereWithoutTechnicalAssessmentsInput.schema';
import { approvalRequestsScalarWhereInputObjectSchema as approvalRequestsScalarWhereInputObjectSchema } from './approvalRequestsScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => approvalRequestsCreateWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => approvalRequestsCreateWithoutTechnicalAssessmentsInputObjectSchema).array(), z.lazy(() => approvalRequestsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => approvalRequestsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => approvalRequestsCreateOrConnectWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => approvalRequestsCreateOrConnectWithoutTechnicalAssessmentsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => approvalRequestsUpsertWithWhereUniqueWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => approvalRequestsUpsertWithWhereUniqueWithoutTechnicalAssessmentsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => approvalRequestsCreateManyTechnicalAssessmentsInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => approvalRequestsWhereUniqueInputObjectSchema), z.lazy(() => approvalRequestsWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => approvalRequestsWhereUniqueInputObjectSchema), z.lazy(() => approvalRequestsWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => approvalRequestsWhereUniqueInputObjectSchema), z.lazy(() => approvalRequestsWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => approvalRequestsWhereUniqueInputObjectSchema), z.lazy(() => approvalRequestsWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => approvalRequestsUpdateWithWhereUniqueWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => approvalRequestsUpdateWithWhereUniqueWithoutTechnicalAssessmentsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => approvalRequestsUpdateManyWithWhereWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => approvalRequestsUpdateManyWithWhereWithoutTechnicalAssessmentsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => approvalRequestsScalarWhereInputObjectSchema), z.lazy(() => approvalRequestsScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const approvalRequestsUpdateManyWithoutTechnicalAssessmentsNestedInputObjectSchema: z.ZodType<Prisma.approvalRequestsUpdateManyWithoutTechnicalAssessmentsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.approvalRequestsUpdateManyWithoutTechnicalAssessmentsNestedInput>;
export const approvalRequestsUpdateManyWithoutTechnicalAssessmentsNestedInputObjectZodSchema = makeSchema();
