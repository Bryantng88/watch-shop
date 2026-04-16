import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { OrderUpdateWithoutItemsInputObjectSchema as OrderUpdateWithoutItemsInputObjectSchema } from './OrderUpdateWithoutItemsInput.schema';
import { OrderUncheckedUpdateWithoutItemsInputObjectSchema as OrderUncheckedUpdateWithoutItemsInputObjectSchema } from './OrderUncheckedUpdateWithoutItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => OrderUpdateWithoutItemsInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutItemsInputObjectSchema)])
}).strict();
export const OrderUpdateToOneWithWhereWithoutItemsInputObjectSchema: z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutItemsInput>;
export const OrderUpdateToOneWithWhereWithoutItemsInputObjectZodSchema = makeSchema();
