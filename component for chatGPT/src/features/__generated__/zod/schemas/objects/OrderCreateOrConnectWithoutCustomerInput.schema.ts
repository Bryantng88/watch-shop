import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderCreateWithoutCustomerInputObjectSchema as OrderCreateWithoutCustomerInputObjectSchema } from './OrderCreateWithoutCustomerInput.schema';
import { OrderUncheckedCreateWithoutCustomerInputObjectSchema as OrderUncheckedCreateWithoutCustomerInputObjectSchema } from './OrderUncheckedCreateWithoutCustomerInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => OrderWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => OrderCreateWithoutCustomerInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutCustomerInputObjectSchema)])
}).strict();
export const OrderCreateOrConnectWithoutCustomerInputObjectSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateOrConnectWithoutCustomerInput>;
export const OrderCreateOrConnectWithoutCustomerInputObjectZodSchema = makeSchema();
