import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderCreateWithoutTradeInAcquisitionsInputObjectSchema as OrderCreateWithoutTradeInAcquisitionsInputObjectSchema } from './OrderCreateWithoutTradeInAcquisitionsInput.schema';
import { OrderUncheckedCreateWithoutTradeInAcquisitionsInputObjectSchema as OrderUncheckedCreateWithoutTradeInAcquisitionsInputObjectSchema } from './OrderUncheckedCreateWithoutTradeInAcquisitionsInput.schema';
import { OrderCreateOrConnectWithoutTradeInAcquisitionsInputObjectSchema as OrderCreateOrConnectWithoutTradeInAcquisitionsInputObjectSchema } from './OrderCreateOrConnectWithoutTradeInAcquisitionsInput.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutTradeInAcquisitionsInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutTradeInAcquisitionsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutTradeInAcquisitionsInputObjectSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputObjectSchema).optional()
}).strict();
export const OrderCreateNestedOneWithoutTradeInAcquisitionsInputObjectSchema: z.ZodType<Prisma.OrderCreateNestedOneWithoutTradeInAcquisitionsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateNestedOneWithoutTradeInAcquisitionsInput>;
export const OrderCreateNestedOneWithoutTradeInAcquisitionsInputObjectZodSchema = makeSchema();
