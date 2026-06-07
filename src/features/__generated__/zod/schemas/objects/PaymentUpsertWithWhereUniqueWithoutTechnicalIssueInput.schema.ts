import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentWhereUniqueInputObjectSchema as PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema';
import { PaymentUpdateWithoutTechnicalIssueInputObjectSchema as PaymentUpdateWithoutTechnicalIssueInputObjectSchema } from './PaymentUpdateWithoutTechnicalIssueInput.schema';
import { PaymentUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as PaymentUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './PaymentUncheckedUpdateWithoutTechnicalIssueInput.schema';
import { PaymentCreateWithoutTechnicalIssueInputObjectSchema as PaymentCreateWithoutTechnicalIssueInputObjectSchema } from './PaymentCreateWithoutTechnicalIssueInput.schema';
import { PaymentUncheckedCreateWithoutTechnicalIssueInputObjectSchema as PaymentUncheckedCreateWithoutTechnicalIssueInputObjectSchema } from './PaymentUncheckedCreateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PaymentWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => PaymentUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => PaymentUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)]),
  create: z.union([z.lazy(() => PaymentCreateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const PaymentUpsertWithWhereUniqueWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.PaymentUpsertWithWhereUniqueWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentUpsertWithWhereUniqueWithoutTechnicalIssueInput>;
export const PaymentUpsertWithWhereUniqueWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
