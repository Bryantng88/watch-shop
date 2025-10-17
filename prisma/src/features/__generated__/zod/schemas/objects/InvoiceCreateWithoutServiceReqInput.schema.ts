import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceTypeSchema } from '../enums/InvoiceType.schema';
import { InvoiceStatusSchema } from '../enums/InvoiceStatus.schema';
import { AcquisitionCreateNestedOneWithoutInvoiceInputObjectSchema as AcquisitionCreateNestedOneWithoutInvoiceInputObjectSchema } from './AcquisitionCreateNestedOneWithoutInvoiceInput.schema';
import { CustomerCreateNestedOneWithoutInvoiceInputObjectSchema as CustomerCreateNestedOneWithoutInvoiceInputObjectSchema } from './CustomerCreateNestedOneWithoutInvoiceInput.schema';
import { OrderCreateNestedOneWithoutInvoiceInputObjectSchema as OrderCreateNestedOneWithoutInvoiceInputObjectSchema } from './OrderCreateNestedOneWithoutInvoiceInput.schema';
import { VendorCreateNestedOneWithoutInvoiceInputObjectSchema as VendorCreateNestedOneWithoutInvoiceInputObjectSchema } from './VendorCreateNestedOneWithoutInvoiceInput.schema';
import { InvoiceItemCreateNestedManyWithoutInvoiceInputObjectSchema as InvoiceItemCreateNestedManyWithoutInvoiceInputObjectSchema } from './InvoiceItemCreateNestedManyWithoutInvoiceInput.schema';
import { PaymentCreateNestedManyWithoutInvoiceInputObjectSchema as PaymentCreateNestedManyWithoutInvoiceInputObjectSchema } from './PaymentCreateNestedManyWithoutInvoiceInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string().optional().nullable(),
  type: InvoiceTypeSchema,
  status: InvoiceStatusSchema.optional(),
  currency: z.string(),
  subTotal: z.number(),
  taxTotal: z.number().optional(),
  discountTotal: z.number().optional(),
  grandTotal: z.number(),
  issuedAt: z.coerce.date().optional().nullable(),
  dueAt: z.coerce.date().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  acquisition: z.lazy(() => AcquisitionCreateNestedOneWithoutInvoiceInputObjectSchema).optional(),
  customer: z.lazy(() => CustomerCreateNestedOneWithoutInvoiceInputObjectSchema).optional(),
  order: z.lazy(() => OrderCreateNestedOneWithoutInvoiceInputObjectSchema).optional(),
  vendor: z.lazy(() => VendorCreateNestedOneWithoutInvoiceInputObjectSchema).optional(),
  items: z.lazy(() => InvoiceItemCreateNestedManyWithoutInvoiceInputObjectSchema).optional(),
  payments: z.lazy(() => PaymentCreateNestedManyWithoutInvoiceInputObjectSchema).optional()
}).strict();
export const InvoiceCreateWithoutServiceReqInputObjectSchema: z.ZodType<Prisma.InvoiceCreateWithoutServiceReqInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCreateWithoutServiceReqInput>;
export const InvoiceCreateWithoutServiceReqInputObjectZodSchema = makeSchema();
