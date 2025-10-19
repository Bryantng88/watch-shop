import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateWithoutVendorInputObjectSchema as InvoiceCreateWithoutVendorInputObjectSchema } from './InvoiceCreateWithoutVendorInput.schema';
import { InvoiceUncheckedCreateWithoutVendorInputObjectSchema as InvoiceUncheckedCreateWithoutVendorInputObjectSchema } from './InvoiceUncheckedCreateWithoutVendorInput.schema';
import { InvoiceCreateOrConnectWithoutVendorInputObjectSchema as InvoiceCreateOrConnectWithoutVendorInputObjectSchema } from './InvoiceCreateOrConnectWithoutVendorInput.schema';
import { InvoiceCreateManyVendorInputEnvelopeObjectSchema as InvoiceCreateManyVendorInputEnvelopeObjectSchema } from './InvoiceCreateManyVendorInputEnvelope.schema';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceCreateWithoutVendorInputObjectSchema), z.lazy(() => InvoiceCreateWithoutVendorInputObjectSchema).array(), z.lazy(() => InvoiceUncheckedCreateWithoutVendorInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutVendorInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => InvoiceCreateOrConnectWithoutVendorInputObjectSchema), z.lazy(() => InvoiceCreateOrConnectWithoutVendorInputObjectSchema).array()]).optional(),
  createMany: z.lazy(() => InvoiceCreateManyVendorInputEnvelopeObjectSchema).optional(),
  connect: z.union([z.lazy(() => InvoiceWhereUniqueInputObjectSchema), z.lazy(() => InvoiceWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const InvoiceUncheckedCreateNestedManyWithoutVendorInputObjectSchema: z.ZodType<Prisma.InvoiceUncheckedCreateNestedManyWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceUncheckedCreateNestedManyWithoutVendorInput>;
export const InvoiceUncheckedCreateNestedManyWithoutVendorInputObjectZodSchema = makeSchema();
