import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { OrderUpdateWithoutTaskInputObjectSchema as OrderUpdateWithoutTaskInputObjectSchema } from './OrderUpdateWithoutTaskInput.schema';
import { OrderUncheckedUpdateWithoutTaskInputObjectSchema as OrderUncheckedUpdateWithoutTaskInputObjectSchema } from './OrderUncheckedUpdateWithoutTaskInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => OrderUpdateWithoutTaskInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutTaskInputObjectSchema)])
}).strict();
export const OrderUpdateToOneWithWhereWithoutTaskInputObjectSchema: z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutTaskInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutTaskInput>;
export const OrderUpdateToOneWithWhereWithoutTaskInputObjectZodSchema = makeSchema();
