import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderCreateWithoutShipmentsInputObjectSchema as OrderCreateWithoutShipmentsInputObjectSchema } from './OrderCreateWithoutShipmentsInput.schema';
import { OrderUncheckedCreateWithoutShipmentsInputObjectSchema as OrderUncheckedCreateWithoutShipmentsInputObjectSchema } from './OrderUncheckedCreateWithoutShipmentsInput.schema';
import { OrderCreateOrConnectWithoutShipmentsInputObjectSchema as OrderCreateOrConnectWithoutShipmentsInputObjectSchema } from './OrderCreateOrConnectWithoutShipmentsInput.schema';
import { OrderUpsertWithoutShipmentsInputObjectSchema as OrderUpsertWithoutShipmentsInputObjectSchema } from './OrderUpsertWithoutShipmentsInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderUpdateToOneWithWhereWithoutShipmentsInputObjectSchema as OrderUpdateToOneWithWhereWithoutShipmentsInputObjectSchema } from './OrderUpdateToOneWithWhereWithoutShipmentsInput.schema';
import { OrderUpdateWithoutShipmentsInputObjectSchema as OrderUpdateWithoutShipmentsInputObjectSchema } from './OrderUpdateWithoutShipmentsInput.schema';
import { OrderUncheckedUpdateWithoutShipmentsInputObjectSchema as OrderUncheckedUpdateWithoutShipmentsInputObjectSchema } from './OrderUncheckedUpdateWithoutShipmentsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutShipmentsInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutShipmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutShipmentsInputObjectSchema).optional(),
  upsert: z.lazy(() => OrderUpsertWithoutShipmentsInputObjectSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => OrderUpdateToOneWithWhereWithoutShipmentsInputObjectSchema), z.lazy(() => OrderUpdateWithoutShipmentsInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutShipmentsInputObjectSchema)]).optional()
}).strict();
export const OrderUpdateOneRequiredWithoutShipmentsNestedInputObjectSchema: z.ZodType<Prisma.OrderUpdateOneRequiredWithoutShipmentsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateOneRequiredWithoutShipmentsNestedInput>;
export const OrderUpdateOneRequiredWithoutShipmentsNestedInputObjectZodSchema = makeSchema();
