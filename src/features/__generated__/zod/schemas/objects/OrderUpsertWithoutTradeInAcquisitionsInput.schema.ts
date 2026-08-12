import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderUpdateWithoutTradeInAcquisitionsInputObjectSchema as OrderUpdateWithoutTradeInAcquisitionsInputObjectSchema } from './OrderUpdateWithoutTradeInAcquisitionsInput.schema';
import { OrderUncheckedUpdateWithoutTradeInAcquisitionsInputObjectSchema as OrderUncheckedUpdateWithoutTradeInAcquisitionsInputObjectSchema } from './OrderUncheckedUpdateWithoutTradeInAcquisitionsInput.schema';
import { OrderCreateWithoutTradeInAcquisitionsInputObjectSchema as OrderCreateWithoutTradeInAcquisitionsInputObjectSchema } from './OrderCreateWithoutTradeInAcquisitionsInput.schema';
import { OrderUncheckedCreateWithoutTradeInAcquisitionsInputObjectSchema as OrderUncheckedCreateWithoutTradeInAcquisitionsInputObjectSchema } from './OrderUncheckedCreateWithoutTradeInAcquisitionsInput.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => OrderUpdateWithoutTradeInAcquisitionsInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutTradeInAcquisitionsInputObjectSchema)]),
  create: z.union([z.lazy(() => OrderCreateWithoutTradeInAcquisitionsInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutTradeInAcquisitionsInputObjectSchema)]),
  where: z.lazy(() => OrderWhereInputObjectSchema).optional()
}).strict();
export const OrderUpsertWithoutTradeInAcquisitionsInputObjectSchema: z.ZodType<Prisma.OrderUpsertWithoutTradeInAcquisitionsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpsertWithoutTradeInAcquisitionsInput>;
export const OrderUpsertWithoutTradeInAcquisitionsInputObjectZodSchema = makeSchema();
