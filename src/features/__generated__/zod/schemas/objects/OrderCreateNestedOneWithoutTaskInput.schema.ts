import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderCreateWithoutTaskInputObjectSchema as OrderCreateWithoutTaskInputObjectSchema } from './OrderCreateWithoutTaskInput.schema';
import { OrderUncheckedCreateWithoutTaskInputObjectSchema as OrderUncheckedCreateWithoutTaskInputObjectSchema } from './OrderUncheckedCreateWithoutTaskInput.schema';
import { OrderCreateOrConnectWithoutTaskInputObjectSchema as OrderCreateOrConnectWithoutTaskInputObjectSchema } from './OrderCreateOrConnectWithoutTaskInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutTaskInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutTaskInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutTaskInputObjectSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputObjectSchema).optional()
}).strict();
export const OrderCreateNestedOneWithoutTaskInputObjectSchema: z.ZodType<Prisma.OrderCreateNestedOneWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateNestedOneWithoutTaskInput>;
export const OrderCreateNestedOneWithoutTaskInputObjectZodSchema = makeSchema();
