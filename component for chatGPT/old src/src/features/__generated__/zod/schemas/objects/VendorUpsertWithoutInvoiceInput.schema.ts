import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorUpdateWithoutInvoiceInputObjectSchema as VendorUpdateWithoutInvoiceInputObjectSchema } from './VendorUpdateWithoutInvoiceInput.schema';
import { VendorUncheckedUpdateWithoutInvoiceInputObjectSchema as VendorUncheckedUpdateWithoutInvoiceInputObjectSchema } from './VendorUncheckedUpdateWithoutInvoiceInput.schema';
import { VendorCreateWithoutInvoiceInputObjectSchema as VendorCreateWithoutInvoiceInputObjectSchema } from './VendorCreateWithoutInvoiceInput.schema';
import { VendorUncheckedCreateWithoutInvoiceInputObjectSchema as VendorUncheckedCreateWithoutInvoiceInputObjectSchema } from './VendorUncheckedCreateWithoutInvoiceInput.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => VendorUpdateWithoutInvoiceInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutInvoiceInputObjectSchema)]),
  create: z.union([z.lazy(() => VendorCreateWithoutInvoiceInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutInvoiceInputObjectSchema)]),
  where: z.lazy(() => VendorWhereInputObjectSchema).optional()
}).strict();
export const VendorUpsertWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.VendorUpsertWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpsertWithoutInvoiceInput>;
export const VendorUpsertWithoutInvoiceInputObjectZodSchema = makeSchema();
