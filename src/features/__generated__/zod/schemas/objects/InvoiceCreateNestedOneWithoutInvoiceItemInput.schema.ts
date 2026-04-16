import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateWithoutInvoiceItemInputObjectSchema as InvoiceCreateWithoutInvoiceItemInputObjectSchema } from './InvoiceCreateWithoutInvoiceItemInput.schema';
import { InvoiceUncheckedCreateWithoutInvoiceItemInputObjectSchema as InvoiceUncheckedCreateWithoutInvoiceItemInputObjectSchema } from './InvoiceUncheckedCreateWithoutInvoiceItemInput.schema';
import { InvoiceCreateOrConnectWithoutInvoiceItemInputObjectSchema as InvoiceCreateOrConnectWithoutInvoiceItemInputObjectSchema } from './InvoiceCreateOrConnectWithoutInvoiceItemInput.schema';
import { InvoiceWhereUniqueInputObjectSchema as InvoiceWhereUniqueInputObjectSchema } from './InvoiceWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => InvoiceCreateWithoutInvoiceItemInputObjectSchema), z.lazy(() => InvoiceUncheckedCreateWithoutInvoiceItemInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => InvoiceCreateOrConnectWithoutInvoiceItemInputObjectSchema).optional(),
  connect: z.lazy(() => InvoiceWhereUniqueInputObjectSchema).optional()
}).strict();
export const InvoiceCreateNestedOneWithoutInvoiceItemInputObjectSchema: z.ZodType<Prisma.InvoiceCreateNestedOneWithoutInvoiceItemInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCreateNestedOneWithoutInvoiceItemInput>;
export const InvoiceCreateNestedOneWithoutInvoiceItemInputObjectZodSchema = makeSchema();
