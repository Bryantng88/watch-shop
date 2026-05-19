import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemScalarWhereInputObjectSchema as OrderItemScalarWhereInputObjectSchema } from './OrderItemScalarWhereInput.schema';
import { OrderItemUpdateManyMutationInputObjectSchema as OrderItemUpdateManyMutationInputObjectSchema } from './OrderItemUpdateManyMutationInput.schema';
import { OrderItemUncheckedUpdateManyWithoutLinkedOrderItemInputObjectSchema as OrderItemUncheckedUpdateManyWithoutLinkedOrderItemInputObjectSchema } from './OrderItemUncheckedUpdateManyWithoutLinkedOrderItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => OrderItemUpdateManyMutationInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateManyWithoutLinkedOrderItemInputObjectSchema)])
}).strict();
export const OrderItemUpdateManyWithWhereWithoutLinkedOrderItemInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateManyWithWhereWithoutLinkedOrderItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateManyWithWhereWithoutLinkedOrderItemInput>;
export const OrderItemUpdateManyWithWhereWithoutLinkedOrderItemInputObjectZodSchema = makeSchema();
