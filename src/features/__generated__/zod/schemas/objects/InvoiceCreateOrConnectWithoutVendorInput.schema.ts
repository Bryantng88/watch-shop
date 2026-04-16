import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceCreateWithoutVendorInputObjectSchema as InvoiceCreateWithoutVendorInputObjectSchema } from './InvoiceCreateWithoutVendorInput.schema';
import { InvoiceUncheckedCreateWithoutVendorInputObjectSchema as InvoiceUncheckedCreateWithoutVendorInputObjectSchema } from './InvoiceUncheckedCreateWithoutVendorInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => InvoiceCreateWithoutVendorInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutVendorInputObjectSchema)])
}).strict();
export const InvoiceCreateOrConnectWithoutVendorInputObjectSchema: z.ZodType<Prisma.InvoiceCreateOrConnectWithoutVendorInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCreateOrConnectWithoutVendorInput>;
export const InvoiceCreateOrConnectWithoutVendorInputObjectZodSchema = makeSchema();
