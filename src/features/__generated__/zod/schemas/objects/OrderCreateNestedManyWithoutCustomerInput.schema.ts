import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderCreateWithoutCustomerInputObjectSchema as OrderCreateWithoutCustomerInputObjectSchema } from './OrderCreateWithoutCustomerInput.schema';
import { OrderUncheckedCreateWithoutCustomerInputObjectSchema as OrderUncheckedCreateWithoutCustomerInputObjectSchema } from './OrderUncheckedCreateWithoutCustomerInput.schema';
import { OrderCreateOrConnectWithoutCustomerInputObjectSchema as OrderCreateOrConnectWithoutCustomerInputObjectSchema } from './OrderCreateOrConnectWithoutCustomerInput.schema';
import { OrderCreateManyCustomerInputEnvelopeObjectSchema as OrderCreateManyCustomerInputEnvelopeObjectSchema } from './OrderCreateManyCustomerInputEnvelope.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutCustomerInputObjectSchema), z.lazy(() => OrderCreateWithoutCustomerInputObjectSchema).array(), z.lazy(() => OrderUncheckedCreateWithoutCustomerInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutCustomerInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => OrderCreateOrConnectWithoutCustomerInputObjectSchema), z.lazy(() => OrderCreateOrConnectWithoutCustomerInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => OrderCreateManyCustomerInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => OrderWhereUniqueInputObjectSchema), z.lazy(() => OrderWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const OrderCreateNestedManyWithoutCustomerInputObjectSchema: z.ZodType<Prisma.OrderCreateNestedManyWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderCreateNestedManyWithoutCustomerInput>;
export const OrderCreateNestedManyWithoutCustomerInputObjectZodSchema = makeSchema();
