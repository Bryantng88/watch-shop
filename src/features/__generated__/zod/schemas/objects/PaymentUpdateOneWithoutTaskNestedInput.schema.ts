import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PaymentCreateWithoutTaskInputObjectSchema as PaymentCreateWithoutTaskInputObjectSchema } from './PaymentCreateWithoutTaskInput.schema';
import { PaymentUncheckedCreateWithoutTaskInputObjectSchema as PaymentUncheckedCreateWithoutTaskInputObjectSchema } from './PaymentUncheckedCreateWithoutTaskInput.schema';
import { PaymentCreateOrConnectWithoutTaskInputObjectSchema as PaymentCreateOrConnectWithoutTaskInputObjectSchema } from './PaymentCreateOrConnectWithoutTaskInput.schema';
import { PaymentUpsertWithoutTaskInputObjectSchema as PaymentUpsertWithoutTaskInputObjectSchema } from './PaymentUpsertWithoutTaskInput.schema';
import { PaymentWhereInputObjectSchema as PaymentWhereInputObjectSchema } from './PaymentWhereInput.schema';
import { PaymentWhereUniqueInputObjectSchema as PaymentWhereUniqueInputObjectSchema } from './PaymentWhereUniqueInput.schema';
import { PaymentUpdateToOneWithWhereWithoutTaskInputObjectSchema as PaymentUpdateToOneWithWhereWithoutTaskInputObjectSchema } from './PaymentUpdateToOneWithWhereWithoutTaskInput.schema';
import { PaymentUpdateWithoutTaskInputObjectSchema as PaymentUpdateWithoutTaskInputObjectSchema } from './PaymentUpdateWithoutTaskInput.schema';
import { PaymentUncheckedUpdateWithoutTaskInputObjectSchema as PaymentUncheckedUpdateWithoutTaskInputObjectSchema } from './PaymentUncheckedUpdateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => PaymentCreateWithoutTaskInputObjectSchema), z.lazy(() => PaymentUncheckedCreateWithoutTaskInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => PaymentCreateOrConnectWithoutTaskInputObjectSchema).optional(),
  upsert: z.lazy(() => PaymentUpsertWithoutTaskInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => PaymentWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => PaymentWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => PaymentWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => PaymentUpdateToOneWithWhereWithoutTaskInputObjectSchema), z.lazy(() => PaymentUpdateWithoutTaskInputObjectSchema), z.lazy(() => PaymentUncheckedUpdateWithoutTaskInputObjectSchema)]).optional()
}).strict();
export const PaymentUpdateOneWithoutTaskNestedInputObjectSchema: z.ZodType<Prisma.PaymentUpdateOneWithoutTaskNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentUpdateOneWithoutTaskNestedInput>;
export const PaymentUpdateOneWithoutTaskNestedInputObjectZodSchema = makeSchema();
