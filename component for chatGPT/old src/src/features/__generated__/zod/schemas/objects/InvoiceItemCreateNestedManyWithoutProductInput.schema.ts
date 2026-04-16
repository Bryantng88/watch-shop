import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceItemCreateWithoutProductInputObjectSchema as InvoiceItemCreateWithoutProductInputObjectSchema } from './InvoiceItemCreateWithoutProductInput.schema';
import { InvoiceItemUncheckedCreateWithoutProductInputObjectSchema as InvoiceItemUncheckedCreateWithoutProductInputObjectSchema } from './InvoiceItemUncheckedCreateWithoutProductInput.schema';
import { InvoiceItemCreateOrConnectWithoutProductInputObjectSchema as InvoiceItemCreateOrConnectWithoutProductInputObjectSchema } from './InvoiceItemCreateOrConnectWithoutProductInput.schema';
import { InvoiceItemCreateManyProductInputEnvelopeObjectSchema as InvoiceItemCreateManyProductInputEnvelopeObjectSchema } from './InvoiceItemCreateManyProductInputEnvelope.schema';
import { InvoiceItemWhereUniqueInputObjectSchema as InvoiceItemWhereUniqueInputObjectSchema } from './InvoiceItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceItemCreateWithoutProductInputObjectSchema), z.lazy(() => InvoiceItemCreateWithoutProductInputObjectSchema).array(), z.lazy(() => InvoiceItemUncheckedCreateWithoutProductInputObjectSchema), z.lazy(() => InvoiceItemUncheckedCreateWithoutProductInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => InvoiceItemCreateOrConnectWithoutProductInputObjectSchema), z.lazy(() => InvoiceItemCreateOrConnectWithoutProductInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => InvoiceItemCreateManyProductInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema), z.lazy(() => InvoiceItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const InvoiceItemCreateNestedManyWithoutProductInputObjectSchema: z.ZodType<Prisma.InvoiceItemCreateNestedManyWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemCreateNestedManyWithoutProductInput>;
export const InvoiceItemCreateNestedManyWithoutProductInputObjectZodSchema = makeSchema();
