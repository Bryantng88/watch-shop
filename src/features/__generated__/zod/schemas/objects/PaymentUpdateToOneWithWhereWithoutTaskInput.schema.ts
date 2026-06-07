import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentWhereInputObjectSchema as PaymentWhereInputObjectSchema } from './PaymentWhereInput.schema';
import { PaymentUpdateWithoutTaskInputObjectSchema as PaymentUpdateWithoutTaskInputObjectSchema } from './PaymentUpdateWithoutTaskInput.schema';
import { PaymentUncheckedUpdateWithoutTaskInputObjectSchema as PaymentUncheckedUpdateWithoutTaskInputObjectSchema } from './PaymentUncheckedUpdateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => PaymentWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => PaymentUpdateWithoutTaskInputObjectSchema), z.lazy(() => PaymentUncheckedUpdateWithoutTaskInputObjectSchema)])
}).strict();
export const PaymentUpdateToOneWithWhereWithoutTaskInputObjectSchema: z.ZodType<Prisma.PaymentUpdateToOneWithWhereWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentUpdateToOneWithWhereWithoutTaskInput>;
export const PaymentUpdateToOneWithWhereWithoutTaskInputObjectZodSchema = makeSchema();
