import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderCreateWithoutOrderItemInputObjectSchema as OrderCreateWithoutOrderItemInputObjectSchema } from './OrderCreateWithoutOrderItemInput.schema';
import { OrderUncheckedCreateWithoutOrderItemInputObjectSchema as OrderUncheckedCreateWithoutOrderItemInputObjectSchema } from './OrderUncheckedCreateWithoutOrderItemInput.schema';
import { OrderCreateOrConnectWithoutOrderItemInputObjectSchema as OrderCreateOrConnectWithoutOrderItemInputObjectSchema } from './OrderCreateOrConnectWithoutOrderItemInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutOrderItemInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutOrderItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutOrderItemInputObjectSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputObjectSchema).optional()
}).strict();
export const OrderCreateNestedOneWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.OrderCreateNestedOneWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateNestedOneWithoutOrderItemInput>;
export const OrderCreateNestedOneWithoutOrderItemInputObjectZodSchema = makeSchema();
