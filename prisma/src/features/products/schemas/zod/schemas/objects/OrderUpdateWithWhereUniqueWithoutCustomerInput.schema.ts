import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderUpdateWithoutCustomerInputObjectSchema as OrderUpdateWithoutCustomerInputObjectSchema } from './OrderUpdateWithoutCustomerInput.schema';
import { OrderUncheckedUpdateWithoutCustomerInputObjectSchema as OrderUncheckedUpdateWithoutCustomerInputObjectSchema } from './OrderUncheckedUpdateWithoutCustomerInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => OrderUpdateWithoutCustomerInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutCustomerInputObjectSchema)])
}).strict();
export const OrderUpdateWithWhereUniqueWithoutCustomerInputObjectSchema: z.ZodType<Prisma.OrderUpdateWithWhereUniqueWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpdateWithWhereUniqueWithoutCustomerInput>;
export const OrderUpdateWithWhereUniqueWithoutCustomerInputObjectZodSchema = makeSchema();
