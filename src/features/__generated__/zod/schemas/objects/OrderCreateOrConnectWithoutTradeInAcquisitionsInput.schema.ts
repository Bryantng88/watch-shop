import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderCreateWithoutTradeInAcquisitionsInputObjectSchema as OrderCreateWithoutTradeInAcquisitionsInputObjectSchema } from './OrderCreateWithoutTradeInAcquisitionsInput.schema';
import { OrderUncheckedCreateWithoutTradeInAcquisitionsInputObjectSchema as OrderUncheckedCreateWithoutTradeInAcquisitionsInputObjectSchema } from './OrderUncheckedCreateWithoutTradeInAcquisitionsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderCreateWithoutTradeInAcquisitionsInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutTradeInAcquisitionsInputObjectSchema)])
}).strict();
export const OrderCreateOrConnectWithoutTradeInAcquisitionsInputObjectSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutTradeInAcquisitionsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateOrConnectWithoutTradeInAcquisitionsInput>;
export const OrderCreateOrConnectWithoutTradeInAcquisitionsInputObjectZodSchema = makeSchema();
