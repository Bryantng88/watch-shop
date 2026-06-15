import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { OrderUpdateWithoutWorkCaseInputObjectSchema as OrderUpdateWithoutWorkCaseInputObjectSchema } from './OrderUpdateWithoutWorkCaseInput.schema';
import { OrderUncheckedUpdateWithoutWorkCaseInputObjectSchema as OrderUncheckedUpdateWithoutWorkCaseInputObjectSchema } from './OrderUncheckedUpdateWithoutWorkCaseInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => OrderUpdateWithoutWorkCaseInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutWorkCaseInputObjectSchema)])
}).strict();
export const OrderUpdateToOneWithWhereWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutWorkCaseInput>;
export const OrderUpdateToOneWithWhereWithoutWorkCaseInputObjectZodSchema = makeSchema();
