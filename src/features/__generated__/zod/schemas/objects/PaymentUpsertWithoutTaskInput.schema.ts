import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentUpdateWithoutTaskInputObjectSchema as PaymentUpdateWithoutTaskInputObjectSchema } from './PaymentUpdateWithoutTaskInput.schema';
import { PaymentUncheckedUpdateWithoutTaskInputObjectSchema as PaymentUncheckedUpdateWithoutTaskInputObjectSchema } from './PaymentUncheckedUpdateWithoutTaskInput.schema';
import { PaymentCreateWithoutTaskInputObjectSchema as PaymentCreateWithoutTaskInputObjectSchema } from './PaymentCreateWithoutTaskInput.schema';
import { PaymentUncheckedCreateWithoutTaskInputObjectSchema as PaymentUncheckedCreateWithoutTaskInputObjectSchema } from './PaymentUncheckedCreateWithoutTaskInput.schema';
import { PaymentWhereInputObjectSchema as PaymentWhereInputObjectSchema } from './PaymentWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => PaymentUpdateWithoutTaskInputObjectSchema), z.lazy(() => PaymentUncheckedUpdateWithoutTaskInputObjectSchema)]),
  create: z.union([z.lazy(() => PaymentCreateWithoutTaskInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutTaskInputObjectSchema)]),
  where: z.lazy(() => PaymentWhereInputObjectSchema).optional()
}).strict();
export const PaymentUpsertWithoutTaskInputObjectSchema: z.ZodType<Prisma.PaymentUpsertWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentUpsertWithoutTaskInput>;
export const PaymentUpsertWithoutTaskInputObjectZodSchema = makeSchema();
