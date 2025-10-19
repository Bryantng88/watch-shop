import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateWithoutOrderInputObjectSchema as InvoiceCreateWithoutOrderInputObjectSchema } from './InvoiceCreateWithoutOrderInput.schema';
import { InvoiceUncheckedCreateWithoutOrderInputObjectSchema as InvoiceUncheckedCreateWithoutOrderInputObjectSchema } from './InvoiceUncheckedCreateWithoutOrderInput.schema';
import { InvoiceCreateOrConnectWithoutOrderInputObjectSchema as InvoiceCreateOrConnectWithoutOrderInputObjectSchema } from './InvoiceCreateOrConnectWithoutOrderInput.schema';
import { InvoiceUpsertWithWhereUniqueWithoutOrderInputObjectSchema as InvoiceUpsertWithWhereUniqueWithoutOrderInputObjectSchema } from './InvoiceUpsertWithWhereUniqueWithoutOrderInput.schema';
import { InvoiceCreateManyOrderInputEnvelopeObjectSchema as InvoiceCreateManyOrderInputEnvelopeObjectSchema } from './InvoiceCreateManyOrderInputEnvelope.schema';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceUpdateWithWhereUniqueWithoutOrderInputObjectSchema as InvoiceUpdateWithWhereUniqueWithoutOrderInputObjectSchema } from './InvoiceUpdateWithWhereUniqueWithoutOrderInput.schema';
import { InvoiceUpdateManyWithWhereWithoutOrderInputObjectSchema as InvoiceUpdateManyWithWhereWithoutOrderInputObjectSchema } from './InvoiceUpdateManyWithWhereWithoutOrderInput.schema';
import { InvoiceScalarWhereInputObjectSchema as InvoiceScalarWhereInputObjectSchema } from './InvoiceScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceCreateWithoutOrderInputObjectSchema), z.lazy(() => InvoiceCreateWithoutOrderInputObjectSchema).array(), z.lazy(() => InvoiceUncheckedCreateWithoutOrderInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutOrderInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => InvoiceCreateOrConnectWithoutOrderInputObjectSchema), z.lazy(() => InvoiceCreateOrConnectWithoutOrderInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => InvoiceUpsertWithWhereUniqueWithoutOrderInputObjectSchema), z.lazy(() => InvoiceUpsertWithWhereUniqueWithoutOrderInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => InvoiceCreateManyOrderInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => InvoiceUpdateWithWhereUniqueWithoutOrderInputObjectSchema), z.lazy(() => InvoiceUpdateWithWhereUniqueWithoutOrderInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => InvoiceUpdateManyWithWhereWithoutOrderInputObjectSchema), z.lazy(() => InvoiceUpdateManyWithWhereWithoutOrderInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => InvoiceScalarWhereInputObjectSchema), z.lazy(() => InvoiceScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const InvoiceUncheckedUpdateManyWithoutOrderNestedInputObjectSchema: z.ZodType<Prisma.InvoiceUncheckedUpdateManyWithoutOrderNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUncheckedUpdateManyWithoutOrderNestedInput>;
export const InvoiceUncheckedUpdateManyWithoutOrderNestedInputObjectZodSchema = makeSchema();
