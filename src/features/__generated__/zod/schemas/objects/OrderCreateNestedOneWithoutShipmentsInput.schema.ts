import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderCreateWithoutShipmentsInputObjectSchema as OrderCreateWithoutShipmentsInputObjectSchema } from './OrderCreateWithoutShipmentsInput.schema';
import { OrderUncheckedCreateWithoutShipmentsInputObjectSchema as OrderUncheckedCreateWithoutShipmentsInputObjectSchema } from './OrderUncheckedCreateWithoutShipmentsInput.schema';
import { OrderCreateOrConnectWithoutShipmentsInputObjectSchema as OrderCreateOrConnectWithoutShipmentsInputObjectSchema } from './OrderCreateOrConnectWithoutShipmentsInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutShipmentsInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutShipmentsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutShipmentsInputObjectSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputObjectSchema).optional()
}).strict();
export const OrderCreateNestedOneWithoutShipmentsInputObjectSchema: z.ZodType<Prisma.OrderCreateNestedOneWithoutShipmentsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateNestedOneWithoutShipmentsInput>;
export const OrderCreateNestedOneWithoutShipmentsInputObjectZodSchema = makeSchema();
