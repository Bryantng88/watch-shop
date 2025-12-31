import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionUncheckedCreateNestedManyWithoutCustomerInputObjectSchema as AcquisitionUncheckedCreateNestedManyWithoutCustomerInputObjectSchema } from './AcquisitionUncheckedCreateNestedManyWithoutCustomerInput.schema';
import { InvoiceUncheckedCreateNestedManyWithoutCustomerInputObjectSchema as InvoiceUncheckedCreateNestedManyWithoutCustomerInputObjectSchema } from './InvoiceUncheckedCreateNestedManyWithoutCustomerInput.schema';
import { OrderUncheckedCreateNestedManyWithoutCustomerInputObjectSchema as OrderUncheckedCreateNestedManyWithoutCustomerInputObjectSchema } from './OrderUncheckedCreateNestedManyWithoutCustomerInput.schema';
import { ServiceRequestUncheckedCreateNestedManyWithoutCustomerInputObjectSchema as ServiceRequestUncheckedCreateNestedManyWithoutCustomerInputObjectSchema } from './ServiceRequestUncheckedCreateNestedManyWithoutCustomerInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().optional().nullable(),
  phone: z.string().max(32).optional().nullable(),
  ward: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  userId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  address: z.string().optional().nullable(),
  Acquisition: z.lazy(() => AcquisitionUncheckedCreateNestedManyWithoutCustomerInputObjectSchema),
  Invoice: z.lazy(() => InvoiceUncheckedCreateNestedManyWithoutCustomerInputObjectSchema),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutCustomerInputObjectSchema),
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutCustomerInputObjectSchema)
}).strict();
export const CustomerUncheckedCreateInputObjectSchema: z.ZodType<Prisma.CustomerUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerUncheckedCreateInput>;
export const CustomerUncheckedCreateInputObjectZodSchema = makeSchema();
