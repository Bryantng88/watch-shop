import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderItemCreateWithoutServiceRequestInputObjectSchema as OrderItemCreateWithoutServiceRequestInputObjectSchema } from './OrderItemCreateWithoutServiceRequestInput.schema';
import { OrderItemUncheckedCreateWithoutServiceRequestInputObjectSchema as OrderItemUncheckedCreateWithoutServiceRequestInputObjectSchema } from './OrderItemUncheckedCreateWithoutServiceRequestInput.schema';
import { OrderItemCreateOrConnectWithoutServiceRequestInputObjectSchema as OrderItemCreateOrConnectWithoutServiceRequestInputObjectSchema } from './OrderItemCreateOrConnectWithoutServiceRequestInput.schema';
import { OrderItemWhereUniqueInputObjectSchema as OrderItemWhereUniqueInputObjectSchema } from './OrderItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderItemCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => OrderItemUncheckedCreateWithoutServiceRequestInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderItemCreateOrConnectWithoutServiceRequestInputObjectSchema).optional(),
  connect: z.lazy(() => OrderItemWhereUniqueInputObjectSchema).optional()
}).strict();
export const OrderItemCreateNestedOneWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.OrderItemCreateNestedOneWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCreateNestedOneWithoutServiceRequestInput>;
export const OrderItemCreateNestedOneWithoutServiceRequestInputObjectZodSchema = makeSchema();
