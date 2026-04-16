import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemCreateWithoutVariantInputObjectSchema as InvoiceItemCreateWithoutVariantInputObjectSchema } from './InvoiceItemCreateWithoutVariantInput.schema';
import { InvoiceItemUncheckedCreateWithoutVariantInputObjectSchema as InvoiceItemUncheckedCreateWithoutVariantInputObjectSchema } from './InvoiceItemUncheckedCreateWithoutVariantInput.schema';
import { InvoiceItemCreateOrConnectWithoutVariantInputObjectSchema as InvoiceItemCreateOrConnectWithoutVariantInputObjectSchema } from './InvoiceItemCreateOrConnectWithoutVariantInput.schema';
import { InvoiceItemUpsertWithWhereUniqueWithoutVariantInputObjectSchema as InvoiceItemUpsertWithWhereUniqueWithoutVariantInputObjectSchema } from './InvoiceItemUpsertWithWhereUniqueWithoutVariantInput.schema';
import { InvoiceItemCreateManyVariantInputEnvelopeObjectSchema as InvoiceItemCreateManyVariantInputEnvelopeObjectSchema } from './InvoiceItemCreateManyVariantInputEnvelope.schema';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './InvoiceItemWhereUniqueInput.schema';
import { InvoiceItemUpdateWithWhereUniqueWithoutVariantInputObjectSchema as InvoiceItemUpdateWithWhereUniqueWithoutVariantInputObjectSchema } from './InvoiceItemUpdateWithWhereUniqueWithoutVariantInput.schema';
import { InvoiceItemUpdateManyWithWhereWithoutVariantInputObjectSchema as InvoiceItemUpdateManyWithWhereWithoutVariantInputObjectSchema } from './InvoiceItemUpdateManyWithWhereWithoutVariantInput.schema';
import { InvoiceItemScalarWhereInputObjectSchema as InvoiceItemScalarWhereInputObjectSchema } from './InvoiceItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceItemCreateWithoutVariantInputObjectSchema), z.lazy(() => InvoiceItemCreateWithoutVariantInputObjectSchema).array(), z.lazy(() => InvoiceItemUncheckedCreateWithoutVariantInputObjectSchema), z.lazy(() => InvoiceItemUncheckedCreateWithoutVariantInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => InvoiceItemCreateOrConnectWithoutVariantInputObjectSchema), z.lazy(() => InvoiceItemCreateOrConnectWithoutVariantInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => InvoiceItemUpsertWithWhereUniqueWithoutVariantInputObjectSchema), z.lazy(() => InvoiceItemUpsertWithWhereUniqueWithoutVariantInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => InvoiceItemCreateManyVariantInputEnvelopeObjectSchema).optional(),
  set: z.union([z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema), z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema), z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema), z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema), z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => InvoiceItemUpdateWithWhereUniqueWithoutVariantInputObjectSchema), z.lazy(() => InvoiceItemUpdateWithWhereUniqueWithoutVariantInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => InvoiceItemUpdateManyWithWhereWithoutVariantInputObjectSchema), z.lazy(() => InvoiceItemUpdateManyWithWhereWithoutVariantInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => InvoiceItemScalarWhereInputObjectSchema), z.lazy(() => InvoiceItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const InvoiceItemUncheckedUpdateManyWithoutVariantNestedInputObjectSchema: z.ZodType<Prisma.InvoiceItemUncheckedUpdateManyWithoutVariantNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemUncheckedUpdateManyWithoutVariantNestedInput>;
export const InvoiceItemUncheckedUpdateManyWithoutVariantNestedInputObjectZodSchema = makeSchema();
