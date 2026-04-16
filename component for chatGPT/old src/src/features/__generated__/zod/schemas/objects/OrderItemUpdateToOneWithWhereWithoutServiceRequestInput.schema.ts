import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './OrderItemWhereInput.schema';
import { OrderItemUpdateWithoutServiceRequestInputObjectSchema as OrderItemUpdateWithoutServiceRequestInputObjectSchema } from './OrderItemUpdateWithoutServiceRequestInput.schema';
import { OrderItemUncheckedUpdateWithoutServiceRequestInputObjectSchema as OrderItemUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './OrderItemUncheckedUpdateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => OrderItemUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const OrderItemUpdateToOneWithWhereWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateToOneWithWhereWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateToOneWithWhereWithoutServiceRequestInput>;
export const OrderItemUpdateToOneWithWhereWithoutServiceRequestInputObjectZodSchema = makeSchema();
