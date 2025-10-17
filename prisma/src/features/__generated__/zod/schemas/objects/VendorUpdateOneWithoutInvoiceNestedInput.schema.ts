import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorCreateWithoutInvoiceInputObjectSchema as VendorCreateWithoutInvoiceInputObjectSchema } from './VendorCreateWithoutInvoiceInput.schema';
import { VendorUncheckedCreateWithoutInvoiceInputObjectSchema as VendorUncheckedCreateWithoutInvoiceInputObjectSchema } from './VendorUncheckedCreateWithoutInvoiceInput.schema';
import { VendorCreateOrConnectWithoutInvoiceInputObjectSchema as VendorCreateOrConnectWithoutInvoiceInputObjectSchema } from './VendorCreateOrConnectWithoutInvoiceInput.schema';
import { VendorUpsertWithoutInvoiceInputObjectSchema as VendorUpsertWithoutInvoiceInputObjectSchema } from './VendorUpsertWithoutInvoiceInput.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './VendorWhereUniqueInput.schema';
import { VendorUpdateToOneWithWhereWithoutInvoiceInputObjectSchema as VendorUpdateToOneWithWhereWithoutInvoiceInputObjectSchema } from './VendorUpdateToOneWithWhereWithoutInvoiceInput.schema';
import { VendorUpdateWithoutInvoiceInputObjectSchema as VendorUpdateWithoutInvoiceInputObjectSchema } from './VendorUpdateWithoutInvoiceInput.schema';
import { VendorUncheckedUpdateWithoutInvoiceInputObjectSchema as VendorUncheckedUpdateWithoutInvoiceInputObjectSchema } from './VendorUncheckedUpdateWithoutInvoiceInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => VendorCreateWithoutInvoiceInputObjectSchema), z.lazy(() => VendorUncheckedCreateWithoutInvoiceInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => VendorCreateOrConnectWithoutInvoiceInputObjectSchema).optional(),
  upsert: z.lazy(() => VendorUpsertWithoutInvoiceInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => VendorWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => VendorWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => VendorWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => VendorUpdateToOneWithWhereWithoutInvoiceInputObjectSchema), z.lazy(() => VendorUpdateWithoutInvoiceInputObjectSchema), z.lazy(() => VendorUncheckedUpdateWithoutInvoiceInputObjectSchema)]).optional()
}).strict();
export const VendorUpdateOneWithoutInvoiceNestedInputObjectSchema: z.ZodType<Prisma.VendorUpdateOneWithoutInvoiceNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUpdateOneWithoutInvoiceNestedInput>;
export const VendorUpdateOneWithoutInvoiceNestedInputObjectZodSchema = makeSchema();
