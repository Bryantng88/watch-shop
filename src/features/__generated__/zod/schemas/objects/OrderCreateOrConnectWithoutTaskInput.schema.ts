import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderCreateWithoutTaskInputObjectSchema as OrderCreateWithoutTaskInputObjectSchema } from './OrderCreateWithoutTaskInput.schema';
import { OrderUncheckedCreateWithoutTaskInputObjectSchema as OrderUncheckedCreateWithoutTaskInputObjectSchema } from './OrderUncheckedCreateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderCreateWithoutTaskInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutTaskInputObjectSchema)])
}).strict();
export const OrderCreateOrConnectWithoutTaskInputObjectSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateOrConnectWithoutTaskInput>;
export const OrderCreateOrConnectWithoutTaskInputObjectZodSchema = makeSchema();
