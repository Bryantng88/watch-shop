import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentWhereUniqueInputObjectSchema as PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema';
import { PaymentCreateWithoutTaskInputObjectSchema as PaymentCreateWithoutTaskInputObjectSchema } from './PaymentCreateWithoutTaskInput.schema';
import { PaymentUncheckedCreateWithoutTaskInputObjectSchema as PaymentUncheckedCreateWithoutTaskInputObjectSchema } from './PaymentUncheckedCreateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PaymentWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => PaymentCreateWithoutTaskInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutTaskInputObjectSchema)])
}).strict();
export const PaymentCreateOrConnectWithoutTaskInputObjectSchema: z.ZodType<Prisma.PaymentCreateOrConnectWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentCreateOrConnectWithoutTaskInput>;
export const PaymentCreateOrConnectWithoutTaskInputObjectZodSchema = makeSchema();
