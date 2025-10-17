import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './CustomerWhereUniqueInput.schema';
import { CustomerCreateWithoutInvoiceInputObjectSchema as CustomerCreateWithoutInvoiceInputObjectSchema } from './CustomerCreateWithoutInvoiceInput.schema';
import { CustomerUncheckedCreateWithoutInvoiceInputObjectSchema as CustomerUncheckedCreateWithoutInvoiceInputObjectSchema } from './CustomerUncheckedCreateWithoutInvoiceInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => CustomerWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => CustomerCreateWithoutInvoiceInputObjectSchema), z.lazy(() => CustomerUncheckedCreateWithoutInvoiceInputObjectSchema)])
}).strict();
export const CustomerCreateOrConnectWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.CustomerCreateOrConnectWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerCreateOrConnectWithoutInvoiceInput>;
export const CustomerCreateOrConnectWithoutInvoiceInputObjectZodSchema = makeSchema();
