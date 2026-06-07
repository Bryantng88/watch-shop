import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderCreateWithoutTaskInputObjectSchema as OrderCreateWithoutTaskInputObjectSchema } from './OrderCreateWithoutTaskInput.schema';
import { OrderUncheckedCreateWithoutTaskInputObjectSchema as OrderUncheckedCreateWithoutTaskInputObjectSchema } from './OrderUncheckedCreateWithoutTaskInput.schema';
import { OrderCreateOrConnectWithoutTaskInputObjectSchema as OrderCreateOrConnectWithoutTaskInputObjectSchema } from './OrderCreateOrConnectWithoutTaskInput.schema';
import { OrderUpsertWithoutTaskInputObjectSchema as OrderUpsertWithoutTaskInputObjectSchema } from './OrderUpsertWithoutTaskInput.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderUpdateToOneWithWhereWithoutTaskInputObjectSchema as OrderUpdateToOneWithWhereWithoutTaskInputObjectSchema } from './OrderUpdateToOneWithWhereWithoutTaskInput.schema';
import { OrderUpdateWithoutTaskInputObjectSchema as OrderUpdateWithoutTaskInputObjectSchema } from './OrderUpdateWithoutTaskInput.schema';
import { OrderUncheckedUpdateWithoutTaskInputObjectSchema as OrderUncheckedUpdateWithoutTaskInputObjectSchema } from './OrderUncheckedUpdateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutTaskInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutTaskInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutTaskInputObjectSchema).optional(),
  upsert: z.lazy(() => OrderUpsertWithoutTaskInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => OrderWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => OrderWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => OrderUpdateToOneWithWhereWithoutTaskInputObjectSchema), z.lazy(() => OrderUpdateWithoutTaskInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutTaskInputObjectSchema)]).optional()
}).strict();
export const OrderUpdateOneWithoutTaskNestedInputObjectSchema: z.ZodType<Prisma.OrderUpdateOneWithoutTaskNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateOneWithoutTaskNestedInput>;
export const OrderUpdateOneWithoutTaskNestedInputObjectZodSchema = makeSchema();
