import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemCreateWithoutVariantInputObjectSchema as InvoiceItemCreateWithoutVariantInputObjectSchema } from './InvoiceItemCreateWithoutVariantInput.schema';
import { InvoiceItemUncheckedCreateWithoutVariantInputObjectSchema as InvoiceItemUncheckedCreateWithoutVariantInputObjectSchema } from './InvoiceItemUncheckedCreateWithoutVariantInput.schema';
import { InvoiceItemCreateOrConnectWithoutVariantInputObjectSchema as InvoiceItemCreateOrConnectWithoutVariantInputObjectSchema } from './InvoiceItemCreateOrConnectWithoutVariantInput.schema';
import { InvoiceItemCreateManyVariantInputEnvelopeObjectSchema as InvoiceItemCreateManyVariantInputEnvelopeObjectSchema } from './InvoiceItemCreateManyVariantInputEnvelope.schema';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './InvoiceItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceItemCreateWithoutVariantInputObjectSchema), z.lazy(() => InvoiceItemCreateWithoutVariantInputObjectSchema).array(), z.lazy(() => InvoiceItemUncheckedCreateWithoutVariantInputObjectSchema), z.lazy(() => InvoiceItemUncheckedCreateWithoutVariantInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => InvoiceItemCreateOrConnectWithoutVariantInputObjectSchema), z.lazy(() => InvoiceItemCreateOrConnectWithoutVariantInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => InvoiceItemCreateManyVariantInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema), z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const InvoiceItemUncheckedCreateNestedManyWithoutVariantInputObjectSchema: z.ZodType<Prisma.InvoiceItemUncheckedCreateNestedManyWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemUncheckedCreateNestedManyWithoutVariantInput>;
export const InvoiceItemUncheckedCreateNestedManyWithoutVariantInputObjectZodSchema = makeSchema();
