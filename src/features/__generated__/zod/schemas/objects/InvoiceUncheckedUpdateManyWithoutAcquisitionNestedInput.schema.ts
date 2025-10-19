import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateWithoutAcquisitionInputObjectSchema as InvoiceCreateWithoutAcquisitionInputObjectSchema } from './InvoiceCreateWithoutAcquisitionInput.schema';
import { InvoiceUncheckedCreateWithoutAcquisitionInputObjectSchema as InvoiceUncheckedCreateWithoutAcquisitionInputObjectSchema } from './InvoiceUncheckedCreateWithoutAcquisitionInput.schema';
import { InvoiceCreateOrConnectWithoutAcquisitionInputObjectSchema as InvoiceCreateOrConnectWithoutAcquisitionInputObjectSchema } from './InvoiceCreateOrConnectWithoutAcquisitionInput.schema';
import { InvoiceUpsertWithWhereUniqueWithoutAcquisitionInputObjectSchema as InvoiceUpsertWithWhereUniqueWithoutAcquisitionInputObjectSchema } from './InvoiceUpsertWithWhereUniqueWithoutAcquisitionInput.schema';
import { InvoiceCreateManyAcquisitionInputEnvelopeObjectSchema as InvoiceCreateManyAcquisitionInputEnvelopeObjectSchema } from './InvoiceCreateManyAcquisitionInputEnvelope.schema';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceUpdateWithWhereUniqueWithoutAcquisitionInputObjectSchema as InvoiceUpdateWithWhereUniqueWithoutAcquisitionInputObjectSchema } from './InvoiceUpdateWithWhereUniqueWithoutAcquisitionInput.schema';
import { InvoiceUpdateManyWithWhereWithoutAcquisitionInputObjectSchema as InvoiceUpdateManyWithWhereWithoutAcquisitionInputObjectSchema } from './InvoiceUpdateManyWithWhereWithoutAcquisitionInput.schema';
import { InvoiceScalarWhereInputObjectSchema as InvoiceScalarWhereInputObjectSchema } from './InvoiceScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => InvoiceCreateWithoutAcquisitionInputObjectSchema).array(), z.lazy(() => InvoiceUncheckedCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutAcquisitionInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => InvoiceCreateOrConnectWithoutAcquisitionInputObjectSchema), z.lazy(() => InvoiceCreateOrConnectWithoutAcquisitionInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => InvoiceUpsertWithWhereUniqueWithoutAcquisitionInputObjectSchema), z.lazy(() => InvoiceUpsertWithWhereUniqueWithoutAcquisitionInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => InvoiceCreateManyAcquisitionInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => InvoiceUpdateWithWhereUniqueWithoutAcquisitionInputObjectSchema), z.lazy(() => InvoiceUpdateWithWhereUniqueWithoutAcquisitionInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => InvoiceUpdateManyWithWhereWithoutAcquisitionInputObjectSchema), z.lazy(() => InvoiceUpdateManyWithWhereWithoutAcquisitionInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => InvoiceScalarWhereInputObjectSchema), z.lazy(() => InvoiceScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const InvoiceUncheckedUpdateManyWithoutAcquisitionNestedInputObjectSchema: z.ZodType<Prisma.InvoiceUncheckedUpdateManyWithoutAcquisitionNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUncheckedUpdateManyWithoutAcquisitionNestedInput>;
export const InvoiceUncheckedUpdateManyWithoutAcquisitionNestedInputObjectZodSchema = makeSchema();
