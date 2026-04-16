import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemCreateWithoutProductVariantInputObjectSchema as InvoiceItemCreateWithoutProductVariantInputObjectSchema } from './InvoiceItemCreateWithoutProductVariantInput.schema';
import { InvoiceItemUncheckedCreateWithoutProductVariantInputObjectSchema as InvoiceItemUncheckedCreateWithoutProductVariantInputObjectSchema } from './InvoiceItemUncheckedCreateWithoutProductVariantInput.schema';
import { InvoiceItemCreateOrConnectWithoutProductVariantInputObjectSchema as InvoiceItemCreateOrConnectWithoutProductVariantInputObjectSchema } from './InvoiceItemCreateOrConnectWithoutProductVariantInput.schema';
import { InvoiceItemUpsertWithWhereUniqueWithoutProductVariantInputObjectSchema as InvoiceItemUpsertWithWhereUniqueWithoutProductVariantInputObjectSchema } from './InvoiceItemUpsertWithWhereUniqueWithoutProductVariantInput.schema';
import { InvoiceItemCreateManyProductVariantInputEnvelopeObjectSchema as InvoiceItemCreateManyProductVariantInputEnvelopeObjectSchema } from './InvoiceItemCreateManyProductVariantInputEnvelope.schema';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './InvoiceItemWhereUniqueInput.schema';
import { InvoiceItemUpdateWithWhereUniqueWithoutProductVariantInputObjectSchema as InvoiceItemUpdateWithWhereUniqueWithoutProductVariantInputObjectSchema } from './InvoiceItemUpdateWithWhereUniqueWithoutProductVariantInput.schema';
import { InvoiceItemUpdateManyWithWhereWithoutProductVariantInputObjectSchema as InvoiceItemUpdateManyWithWhereWithoutProductVariantInputObjectSchema } from './InvoiceItemUpdateManyWithWhereWithoutProductVariantInput.schema';
import { InvoiceItemScalarWhereInputObjectSchema as InvoiceItemScalarWhereInputObjectSchema } from './InvoiceItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceItemCreateWithoutProductVariantInputObjectSchema), z.lazy(() => InvoiceItemCreateWithoutProductVariantInputObjectSchema).array(), z.lazy(() => InvoiceItemUncheckedCreateWithoutProductVariantInputObjectSchema), z.lazy(() => InvoiceItemUncheckedCreateWithoutProductVariantInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => InvoiceItemCreateOrConnectWithoutProductVariantInputObjectSchema), z.lazy(() => InvoiceItemCreateOrConnectWithoutProductVariantInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => InvoiceItemUpsertWithWhereUniqueWithoutProductVariantInputObjectSchema), z.lazy(() => InvoiceItemUpsertWithWhereUniqueWithoutProductVariantInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => InvoiceItemCreateManyProductVariantInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema), z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema), z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema), z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema), z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => InvoiceItemUpdateWithWhereUniqueWithoutProductVariantInputObjectSchema), z.lazy(() => InvoiceItemUpdateWithWhereUniqueWithoutProductVariantInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => InvoiceItemUpdateManyWithWhereWithoutProductVariantInputObjectSchema), z.lazy(() => InvoiceItemUpdateManyWithWhereWithoutProductVariantInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => InvoiceItemScalarWhereInputObjectSchema), z.lazy(() => InvoiceItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const InvoiceItemUpdateManyWithoutProductVariantNestedInputObjectSchema: z.ZodType<Prisma.InvoiceItemUpdateManyWithoutProductVariantNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemUpdateManyWithoutProductVariantNestedInput>;
export const InvoiceItemUpdateManyWithoutProductVariantNestedInputObjectZodSchema = makeSchema();
