import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateWithoutCustomerInputObjectSchema as InvoiceCreateWithoutCustomerInputObjectSchema } from './InvoiceCreateWithoutCustomerInput.schema';
import { InvoiceUncheckedCreateWithoutCustomerInputObjectSchema as InvoiceUncheckedCreateWithoutCustomerInputObjectSchema } from './InvoiceUncheckedCreateWithoutCustomerInput.schema';
import { InvoiceCreateOrConnectWithoutCustomerInputObjectSchema as InvoiceCreateOrConnectWithoutCustomerInputObjectSchema } from './InvoiceCreateOrConnectWithoutCustomerInput.schema';
import { InvoiceUpsertWithWhereUniqueWithoutCustomerInputObjectSchema as InvoiceUpsertWithWhereUniqueWithoutCustomerInputObjectSchema } from './InvoiceUpsertWithWhereUniqueWithoutCustomerInput.schema';
import { InvoiceCreateManyCustomerInputEnvelopeObjectSchema as InvoiceCreateManyCustomerInputEnvelopeObjectSchema } from './InvoiceCreateManyCustomerInputEnvelope.schema';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceUpdateWithWhereUniqueWithoutCustomerInputObjectSchema as InvoiceUpdateWithWhereUniqueWithoutCustomerInputObjectSchema } from './InvoiceUpdateWithWhereUniqueWithoutCustomerInput.schema';
import { InvoiceUpdateManyWithWhereWithoutCustomerInputObjectSchema as InvoiceUpdateManyWithWhereWithoutCustomerInputObjectSchema } from './InvoiceUpdateManyWithWhereWithoutCustomerInput.schema';
import { InvoiceScalarWhereInputObjectSchema as InvoiceScalarWhereInputObjectSchema } from './InvoiceScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceCreateWithoutCustomerInputObjectSchema), z.lazy(() => InvoiceCreateWithoutCustomerInputObjectSchema).array(), z.lazy(() => InvoiceUncheckedCreateWithoutCustomerInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutCustomerInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => InvoiceCreateOrConnectWithoutCustomerInputObjectSchema), z.lazy(() => InvoiceCreateOrConnectWithoutCustomerInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => InvoiceUpsertWithWhereUniqueWithoutCustomerInputObjectSchema), z.lazy(() => InvoiceUpsertWithWhereUniqueWithoutCustomerInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => InvoiceCreateManyCustomerInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => InvoiceUpdateWithWhereUniqueWithoutCustomerInputObjectSchema), z.lazy(() => InvoiceUpdateWithWhereUniqueWithoutCustomerInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => InvoiceUpdateManyWithWhereWithoutCustomerInputObjectSchema), z.lazy(() => InvoiceUpdateManyWithWhereWithoutCustomerInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => InvoiceScalarWhereInputObjectSchema), z.lazy(() => InvoiceScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const InvoiceUncheckedUpdateManyWithoutCustomerNestedInputObjectSchema: z.ZodType<Prisma.InvoiceUncheckedUpdateManyWithoutCustomerNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUncheckedUpdateManyWithoutCustomerNestedInput>;
export const InvoiceUncheckedUpdateManyWithoutCustomerNestedInputObjectZodSchema = makeSchema();
