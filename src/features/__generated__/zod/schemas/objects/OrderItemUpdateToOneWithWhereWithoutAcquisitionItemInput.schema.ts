import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './OrderItemWhereInput.schema';
import { OrderItemUpdateWithoutAcquisitionItemInputObjectSchema as OrderItemUpdateWithoutAcquisitionItemInputObjectSchema } from './OrderItemUpdateWithoutAcquisitionItemInput.schema';
import { OrderItemUncheckedUpdateWithoutAcquisitionItemInputObjectSchema as OrderItemUncheckedUpdateWithoutAcquisitionItemInputObjectSchema } from './OrderItemUncheckedUpdateWithoutAcquisitionItemInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => OrderItemUpdateWithoutAcquisitionItemInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutAcquisitionItemInputObjectSchema)])
}).strict();
export const OrderItemUpdateToOneWithWhereWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.OrderItemUpdateToOneWithWhereWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpdateToOneWithWhereWithoutAcquisitionItemInput>;
export const OrderItemUpdateToOneWithWhereWithoutAcquisitionItemInputObjectZodSchema = makeSchema();
