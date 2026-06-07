import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentCreateWithoutTaskInputObjectSchema as PaymentCreateWithoutTaskInputObjectSchema } from './PaymentCreateWithoutTaskInput.schema';
import { PaymentUncheckedCreateWithoutTaskInputObjectSchema as PaymentUncheckedCreateWithoutTaskInputObjectSchema } from './PaymentUncheckedCreateWithoutTaskInput.schema';
import { PaymentCreateOrConnectWithoutTaskInputObjectSchema as PaymentCreateOrConnectWithoutTaskInputObjectSchema } from './PaymentCreateOrConnectWithoutTaskInput.schema';
import { PaymentWhereUniqueInputObjectSchema as PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PaymentCreateWithoutTaskInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutTaskInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => PaymentCreateOrConnectWithoutTaskInputObjectSchema).optional(),
  connect: z.lazy(() => PaymentWhereUniqueInputObjectSchema).optional()
}).strict();
export const PaymentCreateNestedOneWithoutTaskInputObjectSchema: z.ZodType<Prisma.PaymentCreateNestedOneWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentCreateNestedOneWithoutTaskInput>;
export const PaymentCreateNestedOneWithoutTaskInputObjectZodSchema = makeSchema();
