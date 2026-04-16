import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderUpdateWithoutOrderItemInputObjectSchema as OrderUpdateWithoutOrderItemInputObjectSchema } from './OrderUpdateWithoutOrderItemInput.schema';
import { OrderUncheckedUpdateWithoutOrderItemInputObjectSchema as OrderUncheckedUpdateWithoutOrderItemInputObjectSchema } from './OrderUncheckedUpdateWithoutOrderItemInput.schema';
import { OrderCreateWithoutOrderItemInputObjectSchema as OrderCreateWithoutOrderItemInputObjectSchema } from './OrderCreateWithoutOrderItemInput.schema';
import { OrderUncheckedCreateWithoutOrderItemInputObjectSchema as OrderUncheckedCreateWithoutOrderItemInputObjectSchema } from './OrderUncheckedCreateWithoutOrderItemInput.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => OrderUpdateWithoutOrderItemInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutOrderItemInputObjectSchema)]),
  create: z.union([z.lazy(() => OrderCreateWithoutOrderItemInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutOrderItemInputObjectSchema)]),
  where: z.lazy(() => OrderWhereInputObjectSchema).optional()
}).strict();
export const OrderUpsertWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.OrderUpsertWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpsertWithoutOrderItemInput>;
export const OrderUpsertWithoutOrderItemInputObjectZodSchema = makeSchema();
