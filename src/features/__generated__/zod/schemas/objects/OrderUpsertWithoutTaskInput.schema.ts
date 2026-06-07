import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderUpdateWithoutTaskInputObjectSchema as OrderUpdateWithoutTaskInputObjectSchema } from './OrderUpdateWithoutTaskInput.schema';
import { OrderUncheckedUpdateWithoutTaskInputObjectSchema as OrderUncheckedUpdateWithoutTaskInputObjectSchema } from './OrderUncheckedUpdateWithoutTaskInput.schema';
import { OrderCreateWithoutTaskInputObjectSchema as OrderCreateWithoutTaskInputObjectSchema } from './OrderCreateWithoutTaskInput.schema';
import { OrderUncheckedCreateWithoutTaskInputObjectSchema as OrderUncheckedCreateWithoutTaskInputObjectSchema } from './OrderUncheckedCreateWithoutTaskInput.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => OrderUpdateWithoutTaskInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutTaskInputObjectSchema)]),
  create: z.union([z.lazy(() => OrderCreateWithoutTaskInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutTaskInputObjectSchema)]),
  where: z.lazy(() => OrderWhereInputObjectSchema).optional()
}).strict();
export const OrderUpsertWithoutTaskInputObjectSchema: z.ZodType<Prisma.OrderUpsertWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpsertWithoutTaskInput>;
export const OrderUpsertWithoutTaskInputObjectZodSchema = makeSchema();
