import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerUpdateWithoutInvoiceInputObjectSchema as CustomerUpdateWithoutInvoiceInputObjectSchema } from './CustomerUpdateWithoutInvoiceInput.schema';
import { CustomerUncheckedUpdateWithoutInvoiceInputObjectSchema as CustomerUncheckedUpdateWithoutInvoiceInputObjectSchema } from './CustomerUncheckedUpdateWithoutInvoiceInput.schema';
import { CustomerCreateWithoutInvoiceInputObjectSchema as CustomerCreateWithoutInvoiceInputObjectSchema } from './CustomerCreateWithoutInvoiceInput.schema';
import { CustomerUncheckedCreateWithoutInvoiceInputObjectSchema as CustomerUncheckedCreateWithoutInvoiceInputObjectSchema } from './CustomerUncheckedCreateWithoutInvoiceInput.schema';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './CustomerWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => CustomerUpdateWithoutInvoiceInputObjectSchema), z.lazy(() => CustomerUncheckedUpdateWithoutInvoiceInputObjectSchema)]),
  create: z.union([z.lazy(() => CustomerCreateWithoutInvoiceInputObjectSchema), z.lazy(() => CustomerUncheckedCreateWithoutInvoiceInputObjectSchema)]),
  where: z.lazy(() => CustomerWhereInputObjectSchema).optional()
}).strict();
export const CustomerUpsertWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.CustomerUpsertWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerUpsertWithoutInvoiceInput>;
export const CustomerUpsertWithoutInvoiceInputObjectZodSchema = makeSchema();
