import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateWithoutServiceRequestInputObjectSchema as InvoiceCreateWithoutServiceRequestInputObjectSchema } from './InvoiceCreateWithoutServiceRequestInput.schema';
import { InvoiceUncheckedCreateWithoutServiceRequestInputObjectSchema as InvoiceUncheckedCreateWithoutServiceRequestInputObjectSchema } from './InvoiceUncheckedCreateWithoutServiceRequestInput.schema';
import { InvoiceCreateOrConnectWithoutServiceRequestInputObjectSchema as InvoiceCreateOrConnectWithoutServiceRequestInputObjectSchema } from './InvoiceCreateOrConnectWithoutServiceRequestInput.schema';
import { InvoiceCreateManyServiceRequestInputEnvelopeObjectSchema as InvoiceCreateManyServiceRequestInputEnvelopeObjectSchema } from './InvoiceCreateManyServiceRequestInputEnvelope.schema';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => InvoiceCreateWithoutServiceRequestInputObjectSchema).array(), z.lazy(() => InvoiceUncheckedCreateWithoutServiceRequestInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutServiceRequestInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => InvoiceCreateOrConnectWithoutServiceRequestInputObjectSchema), z.lazy(() => InvoiceCreateOrConnectWithoutServiceRequestInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => InvoiceCreateManyServiceRequestInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const InvoiceUncheckedCreateNestedManyWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.InvoiceUncheckedCreateNestedManyWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUncheckedCreateNestedManyWithoutServiceRequestInput>;
export const InvoiceUncheckedCreateNestedManyWithoutServiceRequestInputObjectZodSchema = makeSchema();
