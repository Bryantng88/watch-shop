import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateWithoutServiceReqInputObjectSchema as InvoiceCreateWithoutServiceReqInputObjectSchema } from './InvoiceCreateWithoutServiceReqInput.schema';
import { InvoiceUncheckedCreateWithoutServiceReqInputObjectSchema as InvoiceUncheckedCreateWithoutServiceReqInputObjectSchema } from './InvoiceUncheckedCreateWithoutServiceReqInput.schema';
import { InvoiceCreateOrConnectWithoutServiceReqInputObjectSchema as InvoiceCreateOrConnectWithoutServiceReqInputObjectSchema } from './InvoiceCreateOrConnectWithoutServiceReqInput.schema';
import { InvoiceCreateManyServiceReqInputEnvelopeObjectSchema as InvoiceCreateManyServiceReqInputEnvelopeObjectSchema } from './InvoiceCreateManyServiceReqInputEnvelope.schema';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceCreateWithoutServiceReqInputObjectSchema), z.lazy(() => InvoiceCreateWithoutServiceReqInputObjectSchema).array(), z.lazy(() => InvoiceUncheckedCreateWithoutServiceReqInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutServiceReqInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => InvoiceCreateOrConnectWithoutServiceReqInputObjectSchema), z.lazy(() => InvoiceCreateOrConnectWithoutServiceReqInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => InvoiceCreateManyServiceReqInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const InvoiceCreateNestedManyWithoutServiceReqInputObjectSchema: z.ZodType<Prisma.InvoiceCreateNestedManyWithoutServiceReqInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCreateNestedManyWithoutServiceReqInput>;
export const InvoiceCreateNestedManyWithoutServiceReqInputObjectZodSchema = makeSchema();
