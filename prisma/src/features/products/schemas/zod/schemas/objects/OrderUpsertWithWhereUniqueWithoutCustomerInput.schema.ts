import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderUpdateWithoutCustomerInputObjectSchema as OrderUpdateWithoutCustomerInputObjectSchema } from './OrderUpdateWithoutCustomerInput.schema';
import { OrderUncheckedUpdateWithoutCustomerInputObjectSchema as OrderUncheckedUpdateWithoutCustomerInputObjectSchema } from './OrderUncheckedUpdateWithoutCustomerInput.schema';
import { OrderCreateWithoutCustomerInputObjectSchema as OrderCreateWithoutCustomerInputObjectSchema } from './OrderCreateWithoutCustomerInput.schema';
import { OrderUncheckedCreateWithoutCustomerInputObjectSchema as OrderUncheckedCreateWithoutCustomerInputObjectSchema } from './OrderUncheckedCreateWithoutCustomerInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => OrderUpdateWithoutCustomerInputObjectSchema), z.lazy(() => OrderUncheckedUpdateWithoutCustomerInputObjectSchema)]),
  create: z.union([z.lazy(() => OrderCreateWithoutCustomerInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutCustomerInputObjectSchema)])
}).strict();
export const OrderUpsertWithWhereUniqueWithoutCustomerInputObjectSchema: z.ZodType<Prisma.OrderUpsertWithWhereUniqueWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUpsertWithWhereUniqueWithoutCustomerInput>;
export const OrderUpsertWithWhereUniqueWithoutCustomerInputObjectZodSchema = makeSchema();
