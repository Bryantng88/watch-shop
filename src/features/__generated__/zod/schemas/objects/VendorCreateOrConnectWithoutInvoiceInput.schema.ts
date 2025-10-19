import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema';
import { VendorCreateWithoutInvoiceInputObjectSchema as VendorCreateWithoutInvoiceInputObjectSchema } from './VendorCreateWithoutInvoiceInput.schema';
import { VendorUncheckedCreateWithoutInvoiceInputObjectSchema as VendorUncheckedCreateWithoutInvoiceInputObjectSchema } from './VendorUncheckedCreateWithoutInvoiceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => VendorWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => VendorCreateWithoutInvoiceInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutInvoiceInputObjectSchema)])
}).strict();
export const VendorCreateOrConnectWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.VendorCreateOrConnectWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateOrConnectWithoutInvoiceInput>;
export const VendorCreateOrConnectWithoutInvoiceInputObjectZodSchema = makeSchema();
