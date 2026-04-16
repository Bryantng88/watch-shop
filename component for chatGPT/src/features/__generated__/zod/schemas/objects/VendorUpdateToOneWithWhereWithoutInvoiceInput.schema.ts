import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema';
import { VendorUpdateWithoutInvoiceInputObjectSchema as VendorUpdateWithoutInvoiceInputObjectSchema } from './VendorUpdateWithoutInvoiceInput.schema';
import { VendorUncheckedUpdateWithoutInvoiceInputObjectSchema as VendorUncheckedUpdateWithoutInvoiceInputObjectSchema } from './VendorUncheckedUpdateWithoutInvoiceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => VendorWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => VendorUpdateWithoutInvoiceInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutInvoiceInputObjectSchema)])
}).strict();
export const VendorUpdateToOneWithWhereWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.VendorUpdateToOneWithWhereWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpdateToOneWithWhereWithoutInvoiceInput>;
export const VendorUpdateToOneWithWhereWithoutInvoiceInputObjectZodSchema = makeSchema();
