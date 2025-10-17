import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateWithoutAcquisitionInputObjectSchema as InvoiceCreateWithoutAcquisitionInputObjectSchema } from './InvoiceCreateWithoutAcquisitionInput.schema';
import { InvoiceUncheckedCreateWithoutAcquisitionInputObjectSchema as InvoiceUncheckedCreateWithoutAcquisitionInputObjectSchema } from './InvoiceUncheckedCreateWithoutAcquisitionInput.schema';
import { InvoiceCreateOrConnectWithoutAcquisitionInputObjectSchema as InvoiceCreateOrConnectWithoutAcquisitionInputObjectSchema } from './InvoiceCreateOrConnectWithoutAcquisitionInput.schema';
import { InvoiceCreateManyAcquisitionInputEnvelopeObjectSchema as InvoiceCreateManyAcquisitionInputEnvelopeObjectSchema } from './InvoiceCreateManyAcquisitionInputEnvelope.schema';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => InvoiceCreateWithoutAcquisitionInputObjectSchema).array(), z.lazy(() => InvoiceUncheckedCreateWithoutAcquisitionInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutAcquisitionInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => InvoiceCreateOrConnectWithoutAcquisitionInputObjectSchema), z.lazy(() => InvoiceCreateOrConnectWithoutAcquisitionInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => InvoiceCreateManyAcquisitionInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const InvoiceCreateNestedManyWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.InvoiceCreateNestedManyWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCreateNestedManyWithoutAcquisitionInput>;
export const InvoiceCreateNestedManyWithoutAcquisitionInputObjectZodSchema = makeSchema();
