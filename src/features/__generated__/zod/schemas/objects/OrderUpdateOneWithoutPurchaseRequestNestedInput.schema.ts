import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderCreateWithoutPurchaseRequestInputObjectSchema as OrderCreateWithoutPurchaseRequestInputObjectSchema } from './OrderCreateWithoutPurchaseRequestInput.schema';
import { OrderUncheckedCreateWithoutPurchaseRequestInputObjectSchema as OrderUncheckedCreateWithoutPurchaseRequestInputObjectSchema } from './OrderUncheckedCreateWithoutPurchaseRequestInput.schema';
import { OrderCreateOrConnectWithoutPurchaseRequestInputObjectSchema as OrderCreateOrConnectWithoutPurchaseRequestInputObjectSchema } from './OrderCreateOrConnectWithoutPurchaseRequestInput.schema';
import { OrderUpsertWithoutPurchaseRequestInputObjectSchema as OrderUpsertWithoutPurchaseRequestInputObjectSchema } from './OrderUpsertWithoutPurchaseRequestInput.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderUpdateToOneWithWhereWithoutPurchaseRequestInputObjectSchema as OrderUpdateToOneWithWhereWithoutPurchaseRequestInputObjectSchema } from './OrderUpdateToOneWithWhereWithoutPurchaseRequestInput.schema';
import { OrderUpdateWithoutPurchaseRequestInputObjectSchema as OrderUpdateWithoutPurchaseRequestInputObjectSchema } from './OrderUpdateWithoutPurchaseRequestInput.schema';
import { OrderUncheckedUpdateWithoutPurchaseRequestInputObjectSchema as OrderUncheckedUpdateWithoutPurchaseRequestInputObjectSchema } from './OrderUncheckedUpdateWithoutPurchaseRequestInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutPurchaseRequestInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutPurchaseRequestInputObjectSchema).optional(),
  upsert: z.lazy(() => OrderUpsertWithoutPurchaseRequestInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => OrderWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => OrderWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => OrderUpdateToOneWithWhereWithoutPurchaseRequestInputObjectSchema), z.lazy(() => OrderUpdateWithoutPurchaseRequestInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutPurchaseRequestInputObjectSchema)]).optional()
}).strict();
export const OrderUpdateOneWithoutPurchaseRequestNestedInputObjectSchema: z.ZodType<Prisma.OrderUpdateOneWithoutPurchaseRequestNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateOneWithoutPurchaseRequestNestedInput>;
export const OrderUpdateOneWithoutPurchaseRequestNestedInputObjectZodSchema = makeSchema();
