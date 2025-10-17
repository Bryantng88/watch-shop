import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderCreateWithoutItemsInputObjectSchema as OrderCreateWithoutItemsInputObjectSchema } from './OrderCreateWithoutItemsInput.schema';
import { OrderUncheckedCreateWithoutItemsInputObjectSchema as OrderUncheckedCreateWithoutItemsInputObjectSchema } from './OrderUncheckedCreateWithoutItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderCreateWithoutItemsInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutItemsInputObjectSchema)])
}).strict();
export const OrderCreateOrConnectWithoutItemsInputObjectSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateOrConnectWithoutItemsInput>;
export const OrderCreateOrConnectWithoutItemsInputObjectZodSchema = makeSchema();
