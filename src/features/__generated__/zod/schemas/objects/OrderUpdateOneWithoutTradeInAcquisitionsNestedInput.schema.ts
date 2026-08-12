import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderCreateWithoutTradeInAcquisitionsInputObjectSchema as OrderCreateWithoutTradeInAcquisitionsInputObjectSchema } from './OrderCreateWithoutTradeInAcquisitionsInput.schema';
import { OrderUncheckedCreateWithoutTradeInAcquisitionsInputObjectSchema as OrderUncheckedCreateWithoutTradeInAcquisitionsInputObjectSchema } from './OrderUncheckedCreateWithoutTradeInAcquisitionsInput.schema';
import { OrderCreateOrConnectWithoutTradeInAcquisitionsInputObjectSchema as OrderCreateOrConnectWithoutTradeInAcquisitionsInputObjectSchema } from './OrderCreateOrConnectWithoutTradeInAcquisitionsInput.schema';
import { OrderUpsertWithoutTradeInAcquisitionsInputObjectSchema as OrderUpsertWithoutTradeInAcquisitionsInputObjectSchema } from './OrderUpsertWithoutTradeInAcquisitionsInput.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderUpdateToOneWithWhereWithoutTradeInAcquisitionsInputObjectSchema as OrderUpdateToOneWithWhereWithoutTradeInAcquisitionsInputObjectSchema } from './OrderUpdateToOneWithWhereWithoutTradeInAcquisitionsInput.schema';
import { OrderUpdateWithoutTradeInAcquisitionsInputObjectSchema as OrderUpdateWithoutTradeInAcquisitionsInputObjectSchema } from './OrderUpdateWithoutTradeInAcquisitionsInput.schema';
import { OrderUncheckedUpdateWithoutTradeInAcquisitionsInputObjectSchema as OrderUncheckedUpdateWithoutTradeInAcquisitionsInputObjectSchema } from './OrderUncheckedUpdateWithoutTradeInAcquisitionsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutTradeInAcquisitionsInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutTradeInAcquisitionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutTradeInAcquisitionsInputObjectSchema).optional(),
  upsert: z.lazy(() => OrderUpsertWithoutTradeInAcquisitionsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => OrderWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => OrderWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => OrderUpdateToOneWithWhereWithoutTradeInAcquisitionsInputObjectSchema), z.lazy(() => OrderUpdateWithoutTradeInAcquisitionsInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutTradeInAcquisitionsInputObjectSchema)]).optional()
}).strict();
export const OrderUpdateOneWithoutTradeInAcquisitionsNestedInputObjectSchema: z.ZodType<Prisma.OrderUpdateOneWithoutTradeInAcquisitionsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateOneWithoutTradeInAcquisitionsNestedInput>;
export const OrderUpdateOneWithoutTradeInAcquisitionsNestedInputObjectZodSchema = makeSchema();
