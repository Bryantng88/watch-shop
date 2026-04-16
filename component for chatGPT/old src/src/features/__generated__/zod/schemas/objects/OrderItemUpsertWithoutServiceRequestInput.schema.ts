import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemUpdateWithoutServiceRequestInputObjectSchema as OrderItemUpdateWithoutServiceRequestInputObjectSchema } from './OrderItemUpdateWithoutServiceRequestInput.schema';
import { OrderItemUncheckedUpdateWithoutServiceRequestInputObjectSchema as OrderItemUncheckedUpdateWithoutServiceRequestInputObjectSchema } from './OrderItemUncheckedUpdateWithoutServiceRequestInput.schema';
import { OrderItemCreateWithoutServiceRequestInputObjectSchema as OrderItemCreateWithoutServiceRequestInputObjectSchema } from './OrderItemCreateWithoutServiceRequestInput.schema';
import { OrderItemUncheckedCreateWithoutServiceRequestInputObjectSchema as OrderItemUncheckedCreateWithoutServiceRequestInputObjectSchema } from './OrderItemUncheckedCreateWithoutServiceRequestInput.schema';
import { OrderItemWhereInputObjectSchema as OrderItemWhereInputObjectSchema } from './OrderItemWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => OrderItemUpdateWithoutServiceRequestInputObjectSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutServiceRequestInputObjectSchema)]),
  create: z.union([z.lazy(() => OrderItemCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutServiceRequestInputObjectSchema)]),
  where: z.lazy(() => OrderItemWhereInputObjectSchema).optional()
}).strict();
export const OrderItemUpsertWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.OrderItemUpsertWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemUpsertWithoutServiceRequestInput>;
export const OrderItemUpsertWithoutServiceRequestInputObjectZodSchema = makeSchema();
