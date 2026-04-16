import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { OrderUpdateWithoutOrderItemInputObjectSchema as OrderUpdateWithoutOrderItemInputObjectSchema } from './OrderUpdateWithoutOrderItemInput.schema';
import { OrderUncheckedUpdateWithoutOrderItemInputObjectSchema as OrderUncheckedUpdateWithoutOrderItemInputObjectSchema } from './OrderUncheckedUpdateWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => OrderUpdateWithoutOrderItemInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutOrderItemInputObjectSchema)])
}).strict();
export const OrderUpdateToOneWithWhereWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutOrderItemInput>;
export const OrderUpdateToOneWithWhereWithoutOrderItemInputObjectZodSchema = makeSchema();
