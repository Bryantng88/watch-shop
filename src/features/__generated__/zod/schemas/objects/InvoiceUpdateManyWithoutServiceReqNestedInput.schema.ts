import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateWithoutServiceReqInputObjectSchema as InvoiceCreateWithoutServiceReqInputObjectSchema } from './InvoiceCreateWithoutServiceReqInput.schema';
import { InvoiceUncheckedCreateWithoutServiceReqInputObjectSchema as InvoiceUncheckedCreateWithoutServiceReqInputObjectSchema } from './InvoiceUncheckedCreateWithoutServiceReqInput.schema';
import { InvoiceCreateOrConnectWithoutServiceReqInputObjectSchema as InvoiceCreateOrConnectWithoutServiceReqInputObjectSchema } from './InvoiceCreateOrConnectWithoutServiceReqInput.schema';
import { InvoiceUpsertWithWhereUniqueWithoutServiceReqInputObjectSchema as InvoiceUpsertWithWhereUniqueWithoutServiceReqInputObjectSchema } from './InvoiceUpsertWithWhereUniqueWithoutServiceReqInput.schema';
import { InvoiceCreateManyServiceReqInputEnvelopeObjectSchema as InvoiceCreateManyServiceReqInputEnvelopeObjectSchema } from './InvoiceCreateManyServiceReqInputEnvelope.schema';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceUpdateWithWhereUniqueWithoutServiceReqInputObjectSchema as InvoiceUpdateWithWhereUniqueWithoutServiceReqInputObjectSchema } from './InvoiceUpdateWithWhereUniqueWithoutServiceReqInput.schema';
import { InvoiceUpdateManyWithWhereWithoutServiceReqInputObjectSchema as InvoiceUpdateManyWithWhereWithoutServiceReqInputObjectSchema } from './InvoiceUpdateManyWithWhereWithoutServiceReqInput.schema';
import { InvoiceScalarWhereInputObjectSchema as InvoiceScalarWhereInputObjectSchema } from './InvoiceScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceCreateWithoutServiceReqInputObjectSchema), z.lazy(() => InvoiceCreateWithoutServiceReqInputObjectSchema).array(), z.lazy(() => InvoiceUncheckedCreateWithoutServiceReqInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutServiceReqInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => InvoiceCreateOrConnectWithoutServiceReqInputObjectSchema), z.lazy(() => InvoiceCreateOrConnectWithoutServiceReqInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => InvoiceUpsertWithWhereUniqueWithoutServiceReqInputObjectSchema), z.lazy(() => InvoiceUpsertWithWhereUniqueWithoutServiceReqInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => InvoiceCreateManyServiceReqInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => InvoiceUpdateWithWhereUniqueWithoutServiceReqInputObjectSchema), z.lazy(() => InvoiceUpdateWithWhereUniqueWithoutServiceReqInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => InvoiceUpdateManyWithWhereWithoutServiceReqInputObjectSchema), z.lazy(() => InvoiceUpdateManyWithWhereWithoutServiceReqInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => InvoiceScalarWhereInputObjectSchema), z.lazy(() => InvoiceScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const InvoiceUpdateManyWithoutServiceReqNestedInputObjectSchema: z.ZodType<Prisma.InvoiceUpdateManyWithoutServiceReqNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUpdateManyWithoutServiceReqNestedInput>;
export const InvoiceUpdateManyWithoutServiceReqNestedInputObjectZodSchema = makeSchema();
