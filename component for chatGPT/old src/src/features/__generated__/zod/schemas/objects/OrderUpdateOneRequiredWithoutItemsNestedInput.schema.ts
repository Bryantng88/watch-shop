import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderCreateWithoutItemsInputObjectSchema as OrderCreateWithoutItemsInputObjectSchema } from './OrderCreateWithoutItemsInput.schema';
import { OrderUncheckedCreateWithoutItemsInputObjectSchema as OrderUncheckedCreateWithoutItemsInputObjectSchema } from './OrderUncheckedCreateWithoutItemsInput.schema';
import { OrderCreateOrConnectWithoutItemsInputObjectSchema as OrderCreateOrConnectWithoutItemsInputObjectSchema } from './OrderCreateOrConnectWithoutItemsInput.schema';
import { OrderUpsertWithoutItemsInputObjectSchema as OrderUpsertWithoutItemsInputObjectSchema } from './OrderUpsertWithoutItemsInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderUpdateToOneWithWhereWithoutItemsInputObjectSchema as OrderUpdateToOneWithWhereWithoutItemsInputObjectSchema } from './OrderUpdateToOneWithWhereWithoutItemsInput.schema';
import { OrderUpdateWithoutItemsInputObjectSchema as OrderUpdateWithoutItemsInputObjectSchema } from './OrderUpdateWithoutItemsInput.schema';
import { OrderUncheckedUpdateWithoutItemsInputObjectSchema as OrderUncheckedUpdateWithoutItemsInputObjectSchema } from './OrderUncheckedUpdateWithoutItemsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutItemsInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutItemsInputObjectSchema).optional(),
  upsert: z.lazy(() => OrderUpsertWithoutItemsInputObjectSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => OrderUpdateToOneWithWhereWithoutItemsInputObjectSchema), z.lazy(() => OrderUpdateWithoutItemsInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutItemsInputObjectSchema)]).optional()
}).strict();
export const OrderUpdateOneRequiredWithoutItemsNestedInputObjectSchema: z.ZodType<Prisma.OrderUpdateOneRequiredWithoutItemsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateOneRequiredWithoutItemsNestedInput>;
export const OrderUpdateOneRequiredWithoutItemsNestedInputObjectZodSchema = makeSchema();
