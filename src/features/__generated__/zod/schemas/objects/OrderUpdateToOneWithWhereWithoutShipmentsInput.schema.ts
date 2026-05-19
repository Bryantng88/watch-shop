import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { OrderUpdateWithoutShipmentsInputObjectSchema as OrderUpdateWithoutShipmentsInputObjectSchema } from './OrderUpdateWithoutShipmentsInput.schema';
import { OrderUncheckedUpdateWithoutShipmentsInputObjectSchema as OrderUncheckedUpdateWithoutShipmentsInputObjectSchema } from './OrderUncheckedUpdateWithoutShipmentsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => OrderUpdateWithoutShipmentsInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutShipmentsInputObjectSchema)])
}).strict();
export const OrderUpdateToOneWithWhereWithoutShipmentsInputObjectSchema: z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutShipmentsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutShipmentsInput>;
export const OrderUpdateToOneWithWhereWithoutShipmentsInputObjectZodSchema = makeSchema();
