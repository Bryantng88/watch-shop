import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentCreateWithoutTechnicalIssueInputObjectSchema as PaymentCreateWithoutTechnicalIssueInputObjectSchema } from './PaymentCreateWithoutTechnicalIssueInput.schema';
import { PaymentUncheckedCreateWithoutTechnicalIssueInputObjectSchema as PaymentUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './PaymentUncheckedCreateWithoutTechnicalIssueInput.schema';
import { PaymentCreateOrConnectWithoutTechnicalIssueInputObjectSchema as PaymentCreateOrConnectWithoutTechnicalIssueInputObjectSchema } from './PaymentCreateOrConnectWithoutTechnicalIssueInput.schema';
import { PaymentCreateManyTechnicalIssueInputEnvelopeObjectSchema as PaymentCreateManyTechnicalIssueInputEnvelopeObjectSchema } from './PaymentCreateManyTechnicalIssueInputEnvelope.schema';
import { PaymentWhereUniqueInputObjectSchema as PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PaymentCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => PaymentCreateWithoutTechnicalIssueInputObjectSchema).array(), z.lazy(() => PaymentUncheckedCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PaymentCreateOrConnectWithoutTechnicalIssueInputObjectSchema), z.lazy(() => PaymentCreateOrConnectWithoutTechnicalIssueInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => PaymentCreateManyTechnicalIssueInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => PaymentWhereUniqueInputObjectSchema), z.lazy(() => PaymentWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const PaymentCreateNestedManyWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.PaymentCreateNestedManyWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentCreateNestedManyWithoutTechnicalIssueInput>;
export const PaymentCreateNestedManyWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
