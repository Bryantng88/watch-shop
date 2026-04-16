import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateWithoutVendorInputObjectSchema as InvoiceCreateWithoutVendorInputObjectSchema } from './InvoiceCreateWithoutVendorInput.schema';
import { InvoiceUncheckedCreateWithoutVendorInputObjectSchema as InvoiceUncheckedCreateWithoutVendorInputObjectSchema } from './InvoiceUncheckedCreateWithoutVendorInput.schema';
import { InvoiceCreateOrConnectWithoutVendorInputObjectSchema as InvoiceCreateOrConnectWithoutVendorInputObjectSchema } from './InvoiceCreateOrConnectWithoutVendorInput.schema';
import { InvoiceUpsertWithWhereUniqueWithoutVendorInputObjectSchema as InvoiceUpsertWithWhereUniqueWithoutVendorInputObjectSchema } from './InvoiceUpsertWithWhereUniqueWithoutVendorInput.schema';
import { InvoiceCreateManyVendorInputEnvelopeObjectSchema as InvoiceCreateManyVendorInputEnvelopeObjectSchema } from './InvoiceCreateManyVendorInputEnvelope.schema';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceUpdateWithWhereUniqueWithoutVendorInputObjectSchema as InvoiceUpdateWithWhereUniqueWithoutVendorInputObjectSchema } from './InvoiceUpdateWithWhereUniqueWithoutVendorInput.schema';
import { InvoiceUpdateManyWithWhereWithoutVendorInputObjectSchema as InvoiceUpdateManyWithWhereWithoutVendorInputObjectSchema } from './InvoiceUpdateManyWithWhereWithoutVendorInput.schema';
import { InvoiceScalarWhereInputObjectSchema as InvoiceScalarWhereInputObjectSchema } from './InvoiceScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceCreateWithoutVendorInputObjectSchema), z.lazy(() => InvoiceCreateWithoutVendorInputObjectSchema).array(), z.lazy(() => InvoiceUncheckedCreateWithoutVendorInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutVendorInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => InvoiceCreateOrConnectWithoutVendorInputObjectSchema), z.lazy(() => InvoiceCreateOrConnectWithoutVendorInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => InvoiceUpsertWithWhereUniqueWithoutVendorInputObjectSchema), z.lazy(() => InvoiceUpsertWithWhereUniqueWithoutVendorInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => InvoiceCreateManyVendorInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => InvoiceUpdateWithWhereUniqueWithoutVendorInputObjectSchema), z.lazy(() => InvoiceUpdateWithWhereUniqueWithoutVendorInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => InvoiceUpdateManyWithWhereWithoutVendorInputObjectSchema), z.lazy(() => InvoiceUpdateManyWithWhereWithoutVendorInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => InvoiceScalarWhereInputObjectSchema), z.lazy(() => InvoiceScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const InvoiceUncheckedUpdateManyWithoutVendorNestedInputObjectSchema: z.ZodType<Prisma.InvoiceUncheckedUpdateManyWithoutVendorNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUncheckedUpdateManyWithoutVendorNestedInput>;
export const InvoiceUncheckedUpdateManyWithoutVendorNestedInputObjectZodSchema = makeSchema();
