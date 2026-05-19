import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderCreateWithoutShipmentsInputObjectSchema as OrderCreateWithoutShipmentsInputObjectSchema } from './OrderCreateWithoutShipmentsInput.schema';
import { OrderUncheckedCreateWithoutShipmentsInputObjectSchema as OrderUncheckedCreateWithoutShipmentsInputObjectSchema } from './OrderUncheckedCreateWithoutShipmentsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderCreateWithoutShipmentsInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutShipmentsInputObjectSchema)])
}).strict();
export const OrderCreateOrConnectWithoutShipmentsInputObjectSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutShipmentsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateOrConnectWithoutShipmentsInput>;
export const OrderCreateOrConnectWithoutShipmentsInputObjectZodSchema = makeSchema();
