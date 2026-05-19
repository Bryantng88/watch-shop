import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderUpdateWithoutShipmentsInputObjectSchema as OrderUpdateWithoutShipmentsInputObjectSchema } from './OrderUpdateWithoutShipmentsInput.schema';
import { OrderUncheckedUpdateWithoutShipmentsInputObjectSchema as OrderUncheckedUpdateWithoutShipmentsInputObjectSchema } from './OrderUncheckedUpdateWithoutShipmentsInput.schema';
import { OrderCreateWithoutShipmentsInputObjectSchema as OrderCreateWithoutShipmentsInputObjectSchema } from './OrderCreateWithoutShipmentsInput.schema';
import { OrderUncheckedCreateWithoutShipmentsInputObjectSchema as OrderUncheckedCreateWithoutShipmentsInputObjectSchema } from './OrderUncheckedCreateWithoutShipmentsInput.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => OrderUpdateWithoutShipmentsInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutShipmentsInputObjectSchema)]),
  create: z.union([z.lazy(() => OrderCreateWithoutShipmentsInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutShipmentsInputObjectSchema)]),
  where: z.lazy(() => OrderWhereInputObjectSchema).optional()
}).strict();
export const OrderUpsertWithoutShipmentsInputObjectSchema: z.ZodType<Prisma.OrderUpsertWithoutShipmentsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpsertWithoutShipmentsInput>;
export const OrderUpsertWithoutShipmentsInputObjectZodSchema = makeSchema();
