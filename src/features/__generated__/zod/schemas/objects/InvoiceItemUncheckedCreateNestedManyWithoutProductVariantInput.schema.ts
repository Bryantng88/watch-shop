import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemCreateWithoutProductVariantInputObjectSchema as InvoiceItemCreateWithoutProductVariantInputObjectSchema } from './InvoiceItemCreateWithoutProductVariantInput.schema';
import { InvoiceItemUncheckedCreateWithoutProductVariantInputObjectSchema as InvoiceItemUncheckedCreateWithoutProductVariantInputObjectSchema } from './InvoiceItemUncheckedCreateWithoutProductVariantInput.schema';
import { InvoiceItemCreateOrConnectWithoutProductVariantInputObjectSchema as InvoiceItemCreateOrConnectWithoutProductVariantInputObjectSchema } from './InvoiceItemCreateOrConnectWithoutProductVariantInput.schema';
import { InvoiceItemCreateManyProductVariantInputEnvelopeObjectSchema as InvoiceItemCreateManyProductVariantInputEnvelopeObjectSchema } from './InvoiceItemCreateManyProductVariantInputEnvelope.schema';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './InvoiceItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceItemCreateWithoutProductVariantInputObjectSchema), z.lazy(() => InvoiceItemCreateWithoutProductVariantInputObjectSchema).array(), z.lazy(() => InvoiceItemUncheckedCreateWithoutProductVariantInputObjectSchema), z.lazy(() => InvoiceItemUncheckedCreateWithoutProductVariantInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => InvoiceItemCreateOrConnectWithoutProductVariantInputObjectSchema), z.lazy(() => InvoiceItemCreateOrConnectWithoutProductVariantInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => InvoiceItemCreateManyProductVariantInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema), z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const InvoiceItemUncheckedCreateNestedManyWithoutProductVariantInputObjectSchema: z.ZodType<Prisma.InvoiceItemUncheckedCreateNestedManyWithoutProductVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemUncheckedCreateNestedManyWithoutProductVariantInput>;
export const InvoiceItemUncheckedCreateNestedManyWithoutProductVariantInputObjectZodSchema = makeSchema();
