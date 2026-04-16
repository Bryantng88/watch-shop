import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderCreateWithoutOrderItemInputObjectSchema as OrderCreateWithoutOrderItemInputObjectSchema } from './OrderCreateWithoutOrderItemInput.schema';
import { OrderUncheckedCreateWithoutOrderItemInputObjectSchema as OrderUncheckedCreateWithoutOrderItemInputObjectSchema } from './OrderUncheckedCreateWithoutOrderItemInput.schema';
import { OrderCreateOrConnectWithoutOrderItemInputObjectSchema as OrderCreateOrConnectWithoutOrderItemInputObjectSchema } from './OrderCreateOrConnectWithoutOrderItemInput.schema';
import { OrderUpsertWithoutOrderItemInputObjectSchema as OrderUpsertWithoutOrderItemInputObjectSchema } from './OrderUpsertWithoutOrderItemInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderUpdateToOneWithWhereWithoutOrderItemInputObjectSchema as OrderUpdateToOneWithWhereWithoutOrderItemInputObjectSchema } from './OrderUpdateToOneWithWhereWithoutOrderItemInput.schema';
import { OrderUpdateWithoutOrderItemInputObjectSchema as OrderUpdateWithoutOrderItemInputObjectSchema } from './OrderUpdateWithoutOrderItemInput.schema';
import { OrderUncheckedUpdateWithoutOrderItemInputObjectSchema as OrderUncheckedUpdateWithoutOrderItemInputObjectSchema } from './OrderUncheckedUpdateWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutOrderItemInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutOrderItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutOrderItemInputObjectSchema).optional(),
  upsert: z.lazy(() => OrderUpsertWithoutOrderItemInputObjectSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => OrderUpdateToOneWithWhereWithoutOrderItemInputObjectSchema), z.lazy(() => OrderUpdateWithoutOrderItemInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutOrderItemInputObjectSchema)]).optional()
}).strict();
export const OrderUpdateOneRequiredWithoutOrderItemNestedInputObjectSchema: z.ZodType<Prisma.OrderUpdateOneRequiredWithoutOrderItemNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateOneRequiredWithoutOrderItemNestedInput>;
export const OrderUpdateOneRequiredWithoutOrderItemNestedInputObjectZodSchema = makeSchema();
