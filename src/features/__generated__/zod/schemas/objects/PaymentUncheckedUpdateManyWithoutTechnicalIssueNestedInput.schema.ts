import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentCreateWithoutTechnicalIssueInputObjectSchema as PaymentCreateWithoutTechnicalIssueInputObjectSchema } from './PaymentCreateWithoutTechnicalIssueInput.schema';
import { PaymentUncheckedCreateWithoutTechnicalIssueInputObjectSchema as PaymentUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './PaymentUncheckedCreateWithoutTechnicalIssueInput.schema';
import { PaymentCreateOrConnectWithoutTechnicalIssueInputObjectSchema as PaymentCreateOrConnectWithoutTechnicalIssueInputObjectSchema } from './PaymentCreateOrConnectWithoutTechnicalIssueInput.schema';
import { PaymentUpsertWithWhereUniqueWithoutTechnicalIssueInputObjectSchema as PaymentUpsertWithWhereUniqueWithoutTechnicalIssueInputObjectSchema } from './PaymentUpsertWithWhereUniqueWithoutTechnicalIssueInput.schema';
import { PaymentCreateManyTechnicalIssueInputEnvelopeObjectSchema as PaymentCreateManyTechnicalIssueInputEnvelopeObjectSchema } from './PaymentCreateManyTechnicalIssueInputEnvelope.schema';
import { PaymentWhereUniqueInputObjectSchema as PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema';
import { PaymentUpdateWithWhereUniqueWithoutTechnicalIssueInputObjectSchema as PaymentUpdateWithWhereUniqueWithoutTechnicalIssueInputObjectSchema } from './PaymentUpdateWithWhereUniqueWithoutTechnicalIssueInput.schema';
import { PaymentUpdateManyWithWhereWithoutTechnicalIssueInputObjectSchema as PaymentUpdateManyWithWhereWithoutTechnicalIssueInputObjectSchema } from './PaymentUpdateManyWithWhereWithoutTechnicalIssueInput.schema';
import { PaymentScalarWhereInputObjectSchema as PaymentScalarWhereInputObjectSchema } from './PaymentScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PaymentCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => PaymentCreateWithoutTechnicalIssueInputObjectSchema).array(), z.lazy(() => PaymentUncheckedCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PaymentCreateOrConnectWithoutTechnicalIssueInputObjectSchema), z.lazy(() => PaymentCreateOrConnectWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PaymentUpsertWithWhereUniqueWithoutTechnicalIssueInputObjectSchema), z.lazy(() => PaymentUpsertWithWhereUniqueWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PaymentCreateManyTechnicalIssueInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => PaymentUpdateWithWhereUniqueWithoutTechnicalIssueInputObjectSchema), z.lazy(() => PaymentUpdateWithWhereUniqueWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PaymentUpdateManyWithWhereWithoutTechnicalIssueInputObjectSchema), z.lazy(() => PaymentUpdateManyWithWhereWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PaymentScalarWhereInputObjectSchema), z.lazy(() => PaymentScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const PaymentUncheckedUpdateManyWithoutTechnicalIssueNestedInputObjectSchema: z.ZodType<Prisma.PaymentUncheckedUpdateManyWithoutTechnicalIssueNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentUncheckedUpdateManyWithoutTechnicalIssueNestedInput>;
export const PaymentUncheckedUpdateManyWithoutTechnicalIssueNestedInputObjectZodSchema = makeSchema();
