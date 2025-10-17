import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderUpdateWithoutItemsInputObjectSchema as OrderUpdateWithoutItemsInputObjectSchema } from './OrderUpdateWithoutItemsInput.schema';
import { OrderUncheckedUpdateWithoutItemsInputObjectSchema as OrderUncheckedUpdateWithoutItemsInputObjectSchema } from './OrderUncheckedUpdateWithoutItemsInput.schema';
import { OrderCreateWithoutItemsInputObjectSchema as OrderCreateWithoutItemsInputObjectSchema } from './OrderCreateWithoutItemsInput.schema';
import { OrderUncheckedCreateWithoutItemsInputObjectSchema as OrderUncheckedCreateWithoutItemsInputObjectSchema } from './OrderUncheckedCreateWithoutItemsInput.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => OrderUpdateWithoutItemsInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutItemsInputObjectSchema)]),
  create: z.union([z.lazy(() => OrderCreateWithoutItemsInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutItemsInputObjectSchema)]),
  where: z.lazy(() => OrderWhereInputObjectSchema).optional()
}).strict();
export const OrderUpsertWithoutItemsInputObjectSchema: z.ZodType<Prisma.OrderUpsertWithoutItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpsertWithoutItemsInput>;
export const OrderUpsertWithoutItemsInputObjectZodSchema = makeSchema();
