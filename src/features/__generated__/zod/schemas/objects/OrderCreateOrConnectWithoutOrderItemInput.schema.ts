import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderCreateWithoutOrderItemInputObjectSchema as OrderCreateWithoutOrderItemInputObjectSchema } from './OrderCreateWithoutOrderItemInput.schema';
import { OrderUncheckedCreateWithoutOrderItemInputObjectSchema as OrderUncheckedCreateWithoutOrderItemInputObjectSchema } from './OrderUncheckedCreateWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderCreateWithoutOrderItemInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutOrderItemInputObjectSchema)])
}).strict();
export const OrderCreateOrConnectWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateOrConnectWithoutOrderItemInput>;
export const OrderCreateOrConnectWithoutOrderItemInputObjectZodSchema = makeSchema();
