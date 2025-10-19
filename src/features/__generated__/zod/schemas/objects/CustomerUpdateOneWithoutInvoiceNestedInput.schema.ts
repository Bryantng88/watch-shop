import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerCreateWithoutInvoiceInputObjectSchema as CustomerCreateWithoutInvoiceInputObjectSchema } from './CustomerCreateWithoutInvoiceInput.schema';
import { CustomerUncheckedCreateWithoutInvoiceInputObjectSchema as CustomerUncheckedCreateWithoutInvoiceInputObjectSchema } from './CustomerUncheckedCreateWithoutInvoiceInput.schema';
import { CustomerCreateOrConnectWithoutInvoiceInputObjectSchema as CustomerCreateOrConnectWithoutInvoiceInputObjectSchema } from './CustomerCreateOrConnectWithoutInvoiceInput.schema';
import { CustomerUpsertWithoutInvoiceInputObjectSchema as CustomerUpsertWithoutInvoiceInputObjectSchema } from './CustomerUpsertWithoutInvoiceInput.schema';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './CustomerWhereInput.schema';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './CustomerWhereUniqueInput.schema';
import { CustomerUpdateToOneWithWhereWithoutInvoiceInputObjectSchema as CustomerUpdateToOneWithWhereWithoutInvoiceInputObjectSchema } from './CustomerUpdateToOneWithWhereWithoutInvoiceInput.schema';
import { CustomerUpdateWithoutInvoiceInputObjectSchema as CustomerUpdateWithoutInvoiceInputObjectSchema } from './CustomerUpdateWithoutInvoiceInput.schema';
import { CustomerUncheckedUpdateWithoutInvoiceInputObjectSchema as CustomerUncheckedUpdateWithoutInvoiceInputObjectSchema } from './CustomerUncheckedUpdateWithoutInvoiceInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => CustomerCreateWithoutInvoiceInputObjectSchema), z.lazy(() => CustomerUncheckedCreateWithoutInvoiceInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => CustomerCreateOrConnectWithoutInvoiceInputObjectSchema).optional(),
  upsert: z.lazy(() => CustomerUpsertWithoutInvoiceInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => CustomerWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => CustomerWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => CustomerWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => CustomerUpdateToOneWithWhereWithoutInvoiceInputObjectSchema), z.lazy(() => CustomerUpdateWithoutInvoiceInputObjectSchema), z.lazy(() => CustomerUncheckedUpdateWithoutInvoiceInputObjectSchema)]).optional()
}).strict();
export const CustomerUpdateOneWithoutInvoiceNestedInputObjectSchema: z.ZodType<Prisma.CustomerUpdateOneWithoutInvoiceNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerUpdateOneWithoutInvoiceNestedInput>;
export const CustomerUpdateOneWithoutInvoiceNestedInputObjectZodSchema = makeSchema();
