import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateWithoutOrderInputObjectSchema as InvoiceCreateWithoutOrderInputObjectSchema } from './InvoiceCreateWithoutOrderInput.schema';
import { InvoiceUncheckedCreateWithoutOrderInputObjectSchema as InvoiceUncheckedCreateWithoutOrderInputObjectSchema } from './InvoiceUncheckedCreateWithoutOrderInput.schema';
import { InvoiceCreateOrConnectWithoutOrderInputObjectSchema as InvoiceCreateOrConnectWithoutOrderInputObjectSchema } from './InvoiceCreateOrConnectWithoutOrderInput.schema';
import { InvoiceCreateManyOrderInputEnvelopeObjectSchema as InvoiceCreateManyOrderInputEnvelopeObjectSchema } from './InvoiceCreateManyOrderInputEnvelope.schema';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceCreateWithoutOrderInputObjectSchema), z.lazy(() => InvoiceCreateWithoutOrderInputObjectSchema).array(), z.lazy(() => InvoiceUncheckedCreateWithoutOrderInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutOrderInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => InvoiceCreateOrConnectWithoutOrderInputObjectSchema), z.lazy(() => InvoiceCreateOrConnectWithoutOrderInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => InvoiceCreateManyOrderInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const InvoiceUncheckedCreateNestedManyWithoutOrderInputObjectSchema: z.ZodType<Prisma.InvoiceUncheckedCreateNestedManyWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUncheckedCreateNestedManyWithoutOrderInput>;
export const InvoiceUncheckedCreateNestedManyWithoutOrderInputObjectZodSchema = makeSchema();
