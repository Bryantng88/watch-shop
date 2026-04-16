import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { OrderCreateWithoutCustomerInputObjectSchema as OrderCreateWithoutCustomerInputObjectSchema } from './OrderCreateWithoutCustomerInput.schema';
import { OrderUncheckedCreateWithoutCustomerInputObjectSchema as OrderUncheckedCreateWithoutCustomerInputObjectSchema } from './OrderUncheckedCreateWithoutCustomerInput.schema';
import { OrderCreateOrConnectWithoutCustomerInputObjectSchema as OrderCreateOrConnectWithoutCustomerInputObjectSchema } from './OrderCreateOrConnectWithoutCustomerInput.schema';
import { OrderUpsertWithWhereUniqueWithoutCustomerInputObjectSchema as OrderUpsertWithWhereUniqueWithoutCustomerInputObjectSchema } from './OrderUpsertWithWhereUniqueWithoutCustomerInput.schema';
import { OrderCreateManyCustomerInputEnvelopeObjectSchema as OrderCreateManyCustomerInputEnvelopeObjectSchema } from './OrderCreateManyCustomerInputEnvelope.schema';
import { OrderWhereUniqueInputObjectSchema as OrderWhereUniqueInputObjectSchema } from './OrderWhereUniqueInput.schema';
import { OrderUpdateWithWhereUniqueWithoutCustomerInputObjectSchema as OrderUpdateWithWhereUniqueWithoutCustomerInputObjectSchema } from './OrderUpdateWithWhereUniqueWithoutCustomerInput.schema';
import { OrderUpdateManyWithWhereWithoutCustomerInputObjectSchema as OrderUpdateManyWithWhereWithoutCustomerInputObjectSchema } from './OrderUpdateManyWithWhereWithoutCustomerInput.schema';
import { OrderScalarWhereInputObjectSchema as OrderScalarWhereInputObjectSchema } from './OrderScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => OrderCreateWithoutCustomerInputObjectSchema), z.lazy(() => OrderCreateWithoutCustomerInputObjectSchema).array(), z.lazy(() => OrderUncheckedCreateWithoutCustomerInputObjectSchema), z.lazy(() => OrderUncheckedCreateWithoutCustomerInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => OrderCreateOrConnectWithoutCustomerInputObjectSchema), z.lazy(() => OrderCreateOrConnectWithoutCustomerInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => OrderUpsertWithWhereUniqueWithoutCustomerInputObjectSchema), z.lazy(() => OrderUpsertWithWhereUniqueWithoutCustomerInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => OrderCreateManyCustomerInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => OrderWhereUniqueInputObjectSchema), z.lazy(() => OrderWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => OrderWhereUniqueInputObjectSchema), z.lazy(() => OrderWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => OrderWhereUniqueInputObjectSchema), z.lazy(() => OrderWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => OrderWhereUniqueInputObjectSchema), z.lazy(() => OrderWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => OrderUpdateWithWhereUniqueWithoutCustomerInputObjectSchema), z.lazy(() => OrderUpdateWithWhereUniqueWithoutCustomerInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => OrderUpdateManyWithWhereWithoutCustomerInputObjectSchema), z.lazy(() => OrderUpdateManyWithWhereWithoutCustomerInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => OrderScalarWhereInputObjectSchema), z.lazy(() => OrderScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const OrderUncheckedUpdateManyWithoutCustomerNestedInputObjectSchema: z.ZodType<Prisma.OrderUncheckedUpdateManyWithoutCustomerNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderUncheckedUpdateManyWithoutCustomerNestedInput>;
export const OrderUncheckedUpdateManyWithoutCustomerNestedInputObjectZodSchema = makeSchema();
