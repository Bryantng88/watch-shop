import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { approvalRequestsCreateWithoutTechnicalAssessmentsInputObjectSchema as approvalRequestsCreateWithoutTechnicalAssessmentsInputObjectSchema } from './approvalRequestsCreateWithoutTechnicalAssessmentsInput.schema';
import { approvalRequestsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema as approvalRequestsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema } from './approvalRequestsUncheckedCreateWithoutTechnicalAssessmentsInput.schema';
import { approvalRequestsCreateOrConnectWithoutTechnicalAssessmentsInputObjectSchema as approvalRequestsCreateOrConnectWithoutTechnicalAssessmentsInputObjectSchema } from './approvalRequestsCreateOrConnectWithoutTechnicalAssessmentsInput.schema';
import { approvalRequestsCreateManyTechnicalAssessmentsInputEnvelopeObjectSchema as approvalRequestsCreateManyTechnicalAssessmentsInputEnvelopeObjectSchema } from './approvalRequestsCreateManyTechnicalAssessmentsInputEnvelope.schema';
import { approvalRequestsWhereUniqueInputObjectSchema as approvalRequestsWhereUniqueInputObjectSchema } from './approvalRequestsWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => approvalRequestsCreateWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => approvalRequestsCreateWithoutTechnicalAssessmentsInputObjectSchema).array(), z.lazy(() => approvalRequestsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => approvalRequestsUncheckedCreateWithoutTechnicalAssessmentsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => approvalRequestsCreateOrConnectWithoutTechnicalAssessmentsInputObjectSchema), z.lazy(() => approvalRequestsCreateOrConnectWithoutTechnicalAssessmentsInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => approvalRequestsCreateManyTechnicalAssessmentsInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => approvalRequestsWhereUniqueInputObjectSchema), z.lazy(() => approvalRequestsWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const approvalRequestsCreateNestedManyWithoutTechnicalAssessmentsInputObjectSchema: z.ZodType<Prisma.approvalRequestsCreateNestedManyWithoutTechnicalAssessmentsInput> = makeSchema() as unknown as z.ZodType<Prisma.approvalRequestsCreateNestedManyWithoutTechnicalAssessmentsInput>;
export const approvalRequestsCreateNestedManyWithoutTechnicalAssessmentsInputObjectZodSchema = makeSchema();
