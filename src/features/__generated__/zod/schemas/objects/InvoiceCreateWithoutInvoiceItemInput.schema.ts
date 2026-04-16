import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceTypeSchema } from '../enums/InvoiceType.schema';
import { InvoiceStatusSchema } from '../enums/InvoiceStatus.schema';
import { AcquisitionCreateNestedOneWithoutInvoiceInputObjectSchema as AcquisitionCreateNestedOneWithoutInvoiceInputObjectSchema } from './AcquisitionCreateNestedOneWithoutInvoiceInput.schema';
import { CustomerCreateNestedOneWithoutInvoiceInputObjectSchema as CustomerCreateNestedOneWithoutInvoiceInputObjectSchema } from './CustomerCreateNestedOneWithoutInvoiceInput.schema';
import { OrderCreateNestedOneWithoutInvoiceInputObjectSchema as OrderCreateNestedOneWithoutInvoiceInputObjectSchema } from './OrderCreateNestedOneWithoutInvoiceInput.schema';
import { ServiceRequestCreateNestedOneWithoutInvoiceInputObjectSchema as ServiceRequestCreateNestedOneWithoutInvoiceInputObjectSchema } from './ServiceRequestCreateNestedOneWithoutInvoiceInput.schema';
import { VendorCreateNestedOneWithoutInvoiceInputObjectSchema as VendorCreateNestedOneWithoutInvoiceInputObjectSchema } from './VendorCreateNestedOneWithoutInvoiceInput.schema'

const makeSchema = () => z.object({
  id: z.string(),
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
  updatedAt: z.coerce.date(),
  Acquisition: z.lazy(() => AcquisitionCreateNestedOneWithoutInvoiceInputObjectSchema).optional(),
  Customer: z.lazy(() => CustomerCreateNestedOneWithoutInvoiceInputObjectSchema).optional(),
  Order: z.lazy(() => OrderCreateNestedOneWithoutInvoiceInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestCreateNestedOneWithoutInvoiceInputObjectSchema).optional(),
  Vendor: z.lazy(() => VendorCreateNestedOneWithoutInvoiceInputObjectSchema).optional()
}).strict();
export const InvoiceCreateWithoutInvoiceItemInputObjectSchema: z.ZodType<Prisma.InvoiceCreateWithoutInvoiceItemInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCreateWithoutInvoiceItemInput>;
export const InvoiceCreateWithoutInvoiceItemInputObjectZodSchema = makeSchema();
