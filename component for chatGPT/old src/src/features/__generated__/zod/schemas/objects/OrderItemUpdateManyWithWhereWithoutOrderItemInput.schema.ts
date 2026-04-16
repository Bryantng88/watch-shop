import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemScalarWhereInputObjectSchema as OrderItemScalarWhereInputObjectSchema } from './OrderItemScalarWhereInput.schema';
import { OrderItemUpdateManyMutationInputObjectSchema as OrderItemUpdateManyMutationInputObjectSchema } from './OrderItemUpdateManyMutationInput.schema';
import { OrderItemUncheckedUpdateManyWithoutOrderItemInputObjectSchema as OrderItemUncheckedUpdateManyWithoutOrderItemInputObjectSchema } from './OrderItemUncheckedUpdateManyWithoutOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => OrderItemUpdateManyMutationInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateManyWithoutOrderItemInputObjectSchema)])
}).strict();
export const OrderItemUpdateManyWithWhereWithoutOrderItemInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateManyWithWhereWithoutOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateManyWithWhereWithoutOrderItemInput>;
export const OrderItemUpdateManyWithWhereWithoutOrderItemInputObjectZodSchema = makeSchema();
