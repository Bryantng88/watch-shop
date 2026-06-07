import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentWhereUniqueInputObjectSchema as PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema';
import { PaymentCreateWithoutTechnicalIssueInputObjectSchema as PaymentCreateWithoutTechnicalIssueInputObjectSchema } from './PaymentCreateWithoutTechnicalIssueInput.schema';
import { PaymentUncheckedCreateWithoutTechnicalIssueInputObjectSchema as PaymentUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './PaymentUncheckedCreateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PaymentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PaymentCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const PaymentCreateOrConnectWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.PaymentCreateOrConnectWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentCreateOrConnectWithoutTechnicalIssueInput>;
export const PaymentCreateOrConnectWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
