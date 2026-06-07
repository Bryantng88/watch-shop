import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentWhereUniqueInputObjectSchema as PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema';
import { PaymentUpdateWithoutTechnicalIssueInputObjectSchema as PaymentUpdateWithoutTechnicalIssueInputObjectSchema } from './PaymentUpdateWithoutTechnicalIssueInput.schema';
import { PaymentUncheckedUpdateWithoutTechnicalIssueInputObjectSchema as PaymentUncheckedUpdateWithoutTechnicalIssueInputObjectSchema } from './PaymentUncheckedUpdateWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PaymentWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => PaymentUpdateWithoutTechnicalIssueInputObjectSchema), z.lazy(() => PaymentUncheckedUpdateWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const PaymentUpdateWithWhereUniqueWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.PaymentUpdateWithWhereUniqueWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentUpdateWithWhereUniqueWithoutTechnicalIssueInput>;
export const PaymentUpdateWithWhereUniqueWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
