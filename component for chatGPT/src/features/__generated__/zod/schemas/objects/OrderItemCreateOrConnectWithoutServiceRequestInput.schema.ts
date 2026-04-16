import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema';
import { OrderItemCreateWithoutServiceRequestInputObjectSchema as OrderItemCreateWithoutServiceRequestInputObjectSchema } from './OrderItemCreateWithoutServiceRequestInput.schema';
import { OrderItemUncheckedCreateWithoutServiceRequestInputObjectSchema as OrderItemUncheckedCreateWithoutServiceRequestInputObjectSchema } from './OrderItemUncheckedCreateWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderItemCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutServiceRequestInputObjectSchema)])
}).strict();
export const OrderItemCreateOrConnectWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.OrderItemCreateOrConnectWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateOrConnectWithoutServiceRequestInput>;
export const OrderItemCreateOrConnectWithoutServiceRequestInputObjectZodSchema = makeSchema();
