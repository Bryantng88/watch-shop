import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorCreateWithoutInvoiceInputObjectSchema as VendorCreateWithoutInvoiceInputObjectSchema } from './VendorCreateWithoutInvoiceInput.schema';
import { VendorUncheckedCreateWithoutInvoiceInputObjectSchema as VendorUncheckedCreateWithoutInvoiceInputObjectSchema } from './VendorUncheckedCreateWithoutInvoiceInput.schema';
import { VendorCreateOrConnectWithoutInvoiceInputObjectSchema as VendorCreateOrConnectWithoutInvoiceInputObjectSchema } from './VendorCreateOrConnectWithoutInvoiceInput.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => VendorCreateWithoutInvoiceInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutInvoiceInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => VendorCreateOrConnectWithoutInvoiceInputObjectSchema).optional(),
  connect: z.lazy(() => VendorWhereUniqueInputObjectSchema).optional()
}).strict();
export const VendorCreateNestedOneWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.VendorCreateNestedOneWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateNestedOneWithoutInvoiceInput>;
export const VendorCreateNestedOneWithoutInvoiceInputObjectZodSchema = makeSchema();
