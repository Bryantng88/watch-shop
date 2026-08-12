import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { OrderUpdateWithoutTradeInAcquisitionsInputObjectSchema as OrderUpdateWithoutTradeInAcquisitionsInputObjectSchema } from './OrderUpdateWithoutTradeInAcquisitionsInput.schema';
import { OrderUncheckedUpdateWithoutTradeInAcquisitionsInputObjectSchema as OrderUncheckedUpdateWithoutTradeInAcquisitionsInputObjectSchema } from './OrderUncheckedUpdateWithoutTradeInAcquisitionsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => OrderUpdateWithoutTradeInAcquisitionsInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutTradeInAcquisitionsInputObjectSchema)])
}).strict();
export const OrderUpdateToOneWithWhereWithoutTradeInAcquisitionsInputObjectSchema: z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutTradeInAcquisitionsInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutTradeInAcquisitionsInput>;
export const OrderUpdateToOneWithWhereWithoutTradeInAcquisitionsInputObjectZodSchema = makeSchema();
