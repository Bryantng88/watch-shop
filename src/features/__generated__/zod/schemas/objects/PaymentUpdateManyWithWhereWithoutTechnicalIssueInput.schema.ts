import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentScalarWhereInputObjectSchema as PaymentScalarWhereInputObjectSchema } from './PaymentScalarWhereInput.schema';
import { PaymentUpdateManyMutationInputObjectSchema as PaymentUpdateManyMutationInputObjectSchema } from './PaymentUpdateManyMutationInput.schema';
import { PaymentUncheckedUpdateManyWithoutTechnicalIssueInputObjectSchema as PaymentUncheckedUpdateManyWithoutTechnicalIssueInputObjectSchema } from './PaymentUncheckedUpdateManyWithoutTechnicalIssueInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PaymentScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => PaymentUpdateManyMutationInputObjectSchema), z.lazy(() => PaymentUncheckedUpdateManyWithoutTechnicalIssueInputObjectSchema)])
}).strict();
export const PaymentUpdateManyWithWhereWithoutTechnicalIssueInputObjectSchema: z.ZodType<Prisma.PaymentUpdateManyWithWhereWithoutTechnicalIssueInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentUpdateManyWithWhereWithoutTechnicalIssueInput>;
export const PaymentUpdateManyWithWhereWithoutTechnicalIssueInputObjectZodSchema = makeSchema();
