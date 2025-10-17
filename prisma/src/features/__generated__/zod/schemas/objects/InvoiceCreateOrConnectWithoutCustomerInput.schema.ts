import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema';
import { InvoiceCreateWithoutCustomerInputObjectSchema as InvoiceCreateWithoutCustomerInputObjectSchema } from './InvoiceCreateWithoutCustomerInput.schema';
import { InvoiceUncheckedCreateWithoutCustomerInputObjectSchema as InvoiceUncheckedCreateWithoutCustomerInputObjectSchema } from './InvoiceUncheckedCreateWithoutCustomerInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => InvoiceWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => InvoiceCreateWithoutCustomerInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutCustomerInputObjectSchema)])
}).strict();
export const InvoiceCreateOrConnectWithoutCustomerInputObjectSchema: z.ZodType<Prisma.InvoiceCreateOrConnectWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCreateOrConnectWithoutCustomerInput>;
export const InvoiceCreateOrConnectWithoutCustomerInputObjectZodSchema = makeSchema();
