import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemCreateWithoutProductInputObjectSchema as InvoiceItemCreateWithoutProductInputObjectSchema } from './InvoiceItemCreateWithoutProductInput.schema';
import { InvoiceItemUncheckedCreateWithoutProductInputObjectSchema as InvoiceItemUncheckedCreateWithoutProductInputObjectSchema } from './InvoiceItemUncheckedCreateWithoutProductInput.schema';
import { InvoiceItemCreateOrConnectWithoutProductInputObjectSchema as InvoiceItemCreateOrConnectWithoutProductInputObjectSchema } from './InvoiceItemCreateOrConnectWithoutProductInput.schema';
import { InvoiceItemUpsertWithWhereUniqueWithoutProductInputObjectSchema as InvoiceItemUpsertWithWhereUniqueWithoutProductInputObjectSchema } from './InvoiceItemUpsertWithWhereUniqueWithoutProductInput.schema';
import { InvoiceItemCreateManyProductInputEnvelopeObjectSchema as InvoiceItemCreateManyProductInputEnvelopeObjectSchema } from './InvoiceItemCreateManyProductInputEnvelope.schema';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './InvoiceItemWhereUniqueInput.schema';
import { InvoiceItemUpdateWithWhereUniqueWithoutProductInputObjectSchema as InvoiceItemUpdateWithWhereUniqueWithoutProductInputObjectSchema } from './InvoiceItemUpdateWithWhereUniqueWithoutProductInput.schema';
import { InvoiceItemUpdateManyWithWhereWithoutProductInputObjectSchema as InvoiceItemUpdateManyWithWhereWithoutProductInputObjectSchema } from './InvoiceItemUpdateManyWithWhereWithoutProductInput.schema';
import { InvoiceItemScalarWhereInputObjectSchema as InvoiceItemScalarWhereInputObjectSchema } from './InvoiceItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceItemCreateWithoutProductInputObjectSchema), z.lazy(() => InvoiceItemCreateWithoutProductInputObjectSchema).array(), z.lazy(() => InvoiceItemUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => InvoiceItemUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => InvoiceItemCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => InvoiceItemCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => InvoiceItemUpsertWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => InvoiceItemUpsertWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => InvoiceItemCreateManyProductInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema), z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema), z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema), z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema), z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => InvoiceItemUpdateWithWhereUniqueWithoutProductInputObjectSchema), z.lazy(() => InvoiceItemUpdateWithWhereUniqueWithoutProductInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => InvoiceItemUpdateManyWithWhereWithoutProductInputObjectSchema), z.lazy(() => InvoiceItemUpdateManyWithWhereWithoutProductInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => InvoiceItemScalarWhereInputObjectSchema), z.lazy(() => InvoiceItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const InvoiceItemUpdateManyWithoutProductNestedInputObjectSchema: z.ZodType<Prisma.InvoiceItemUpdateManyWithoutProductNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemUpdateManyWithoutProductNestedInput>;
export const InvoiceItemUpdateManyWithoutProductNestedInputObjectZodSchema = makeSchema();
