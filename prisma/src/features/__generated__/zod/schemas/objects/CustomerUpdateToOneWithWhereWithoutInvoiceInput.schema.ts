import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './CustomerWhereInput.schema';
import { CustomerUpdateWithoutInvoiceInputObjectSchema as CustomerUpdateWithoutInvoiceInputObjectSchema } from './CustomerUpdateWithoutInvoiceInput.schema';
import { CustomerUncheckedUpdateWithoutInvoiceInputObjectSchema as CustomerUncheckedUpdateWithoutInvoiceInputObjectSchema } from './CustomerUncheckedUpdateWithoutInvoiceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CustomerWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => CustomerUpdateWithoutInvoiceInputObjectSchema), z.lazy(() => CustomerUncheckedUpdateWithoutInvoiceInputObjectSchema)])
}).strict();
export const CustomerUpdateToOneWithWhereWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.CustomerUpdateToOneWithWhereWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerUpdateToOneWithWhereWithoutInvoiceInput>;
export const CustomerUpdateToOneWithWhereWithoutInvoiceInputObjectZodSchema = makeSchema();
