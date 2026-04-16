import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerCreateWithoutInvoiceInputObjectSchema as CustomerCreateWithoutInvoiceInputObjectSchema } from './CustomerCreateWithoutInvoiceInput.schema';
import { CustomerUncheckedCreateWithoutInvoiceInputObjectSchema as CustomerUncheckedCreateWithoutInvoiceInputObjectSchema } from './CustomerUncheckedCreateWithoutInvoiceInput.schema';
import { CustomerCreateOrConnectWithoutInvoiceInputObjectSchema as CustomerCreateOrConnectWithoutInvoiceInputObjectSchema } from './CustomerCreateOrConnectWithoutInvoiceInput.schema';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './CustomerWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CustomerCreateWithoutInvoiceInputObjectSchema), z.lazy(() => CustomerUncheckedCreateWithoutInvoiceInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CustomerCreateOrConnectWithoutInvoiceInputObjectSchema).optional(),
  connect: z.lazy(() => CustomerWhereUniqueInputObjectSchema).optional()
}).strict();
export const CustomerCreateNestedOneWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.CustomerCreateNestedOneWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerCreateNestedOneWithoutInvoiceInput>;
export const CustomerCreateNestedOneWithoutInvoiceInputObjectZodSchema = makeSchema();
