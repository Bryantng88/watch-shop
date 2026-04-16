import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateWithoutServiceRequestInputObjectSchema as InvoiceCreateWithoutServiceRequestInputObjectSchema } from './InvoiceCreateWithoutServiceRequestInput.schema';
import { InvoiceUncheckedCreateWithoutServiceRequestInputObjectSchema as InvoiceUncheckedCreateWithoutServiceRequestInputObjectSchema } from './InvoiceUncheckedCreateWithoutServiceRequestInput.schema';
import { InvoiceCreateOrConnectWithoutServiceRequestInputObjectSchema as InvoiceCreateOrConnectWithoutServiceRequestInputObjectSchema } from './InvoiceCreateOrConnectWithoutServiceRequestInput.schema';
import { InvoiceUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema as InvoiceUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema } from './InvoiceUpsertWithWhereUniqueWithoutServiceRequestInput.schema';
import { InvoiceCreateManyServiceRequestInputEnvelopeObjectSchema as InvoiceCreateManyServiceRequestInputEnvelopeObjectSchema } from './InvoiceCreateManyServiceRequestInputEnvelope.schema';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema as InvoiceUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema } from './InvoiceUpdateWithWhereUniqueWithoutServiceRequestInput.schema';
import { InvoiceUpdateManyWithWhereWithoutServiceRequestInputObjectSchema as InvoiceUpdateManyWithWhereWithoutServiceRequestInputObjectSchema } from './InvoiceUpdateManyWithWhereWithoutServiceRequestInput.schema';
import { InvoiceScalarWhereInputObjectSchema as InvoiceScalarWhereInputObjectSchema } from './InvoiceScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => InvoiceCreateWithoutServiceRequestInputObjectSchema).array(), z.lazy(() => InvoiceUncheckedCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutServiceRequestInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => InvoiceCreateOrConnectWithoutServiceRequestInputObjectSchema), z.lazy(() => InvoiceCreateOrConnectWithoutServiceRequestInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => InvoiceUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema), z.lazy(() => InvoiceUpsertWithWhereUniqueWithoutServiceRequestInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => InvoiceCreateManyServiceRequestInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => InvoiceUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema), z.lazy(() => InvoiceUpdateWithWhereUniqueWithoutServiceRequestInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => InvoiceUpdateManyWithWhereWithoutServiceRequestInputObjectSchema), z.lazy(() => InvoiceUpdateManyWithWhereWithoutServiceRequestInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => InvoiceScalarWhereInputObjectSchema), z.lazy(() => InvoiceScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const InvoiceUncheckedUpdateManyWithoutServiceRequestNestedInputObjectSchema: z.ZodType<Prisma.InvoiceUncheckedUpdateManyWithoutServiceRequestNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUncheckedUpdateManyWithoutServiceRequestNestedInput>;
export const InvoiceUncheckedUpdateManyWithoutServiceRequestNestedInputObjectZodSchema = makeSchema();
