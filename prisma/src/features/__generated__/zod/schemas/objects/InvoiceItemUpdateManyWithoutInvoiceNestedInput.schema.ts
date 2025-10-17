import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemCreateWithoutInvoiceInputObjectSchema as InvoiceItemCreateWithoutInvoiceInputObjectSchema } from './InvoiceItemCreateWithoutInvoiceInput.schema';
import { InvoiceItemUncheckedCreateWithoutInvoiceInputObjectSchema as InvoiceItemUncheckedCreateWithoutInvoiceInputObjectSchema } from './InvoiceItemUncheckedCreateWithoutInvoiceInput.schema';
import { InvoiceItemCreateOrConnectWithoutInvoiceInputObjectSchema as InvoiceItemCreateOrConnectWithoutInvoiceInputObjectSchema } from './InvoiceItemCreateOrConnectWithoutInvoiceInput.schema';
import { InvoiceItemUpsertWithWhereUniqueWithoutInvoiceInputObjectSchema as InvoiceItemUpsertWithWhereUniqueWithoutInvoiceInputObjectSchema } from './InvoiceItemUpsertWithWhereUniqueWithoutInvoiceInput.schema';
import { InvoiceItemCreateManyInvoiceInputEnvelopeObjectSchema as InvoiceItemCreateManyInvoiceInputEnvelopeObjectSchema } from './InvoiceItemCreateManyInvoiceInputEnvelope.schema';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './InvoiceItemWhereUniqueInput.schema';
import { InvoiceItemUpdateWithWhereUniqueWithoutInvoiceInputObjectSchema as InvoiceItemUpdateWithWhereUniqueWithoutInvoiceInputObjectSchema } from './InvoiceItemUpdateWithWhereUniqueWithoutInvoiceInput.schema';
import { InvoiceItemUpdateManyWithWhereWithoutInvoiceInputObjectSchema as InvoiceItemUpdateManyWithWhereWithoutInvoiceInputObjectSchema } from './InvoiceItemUpdateManyWithWhereWithoutInvoiceInput.schema';
import { InvoiceItemScalarWhereInputObjectSchema as InvoiceItemScalarWhereInputObjectSchema } from './InvoiceItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceItemCreateWithoutInvoiceInputObjectSchema), z.lazy(() => InvoiceItemCreateWithoutInvoiceInputObjectSchema).array(), z.lazy(() => InvoiceItemUncheckedCreateWithoutInvoiceInputObjectSchema), z.lazy(() => InvoiceItemUncheckedCreateWithoutInvoiceInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => InvoiceItemCreateOrConnectWithoutInvoiceInputObjectSchema), z.lazy(() => InvoiceItemCreateOrConnectWithoutInvoiceInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => InvoiceItemUpsertWithWhereUniqueWithoutInvoiceInputObjectSchema), z.lazy(() => InvoiceItemUpsertWithWhereUniqueWithoutInvoiceInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => InvoiceItemCreateManyInvoiceInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema), z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema), z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema), z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema), z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => InvoiceItemUpdateWithWhereUniqueWithoutInvoiceInputObjectSchema), z.lazy(() => InvoiceItemUpdateWithWhereUniqueWithoutInvoiceInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => InvoiceItemUpdateManyWithWhereWithoutInvoiceInputObjectSchema), z.lazy(() => InvoiceItemUpdateManyWithWhereWithoutInvoiceInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => InvoiceItemScalarWhereInputObjectSchema), z.lazy(() => InvoiceItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const InvoiceItemUpdateManyWithoutInvoiceNestedInputObjectSchema: z.ZodType<Prisma.InvoiceItemUpdateManyWithoutInvoiceNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemUpdateManyWithoutInvoiceNestedInput>;
export const InvoiceItemUpdateManyWithoutInvoiceNestedInputObjectZodSchema = makeSchema();
