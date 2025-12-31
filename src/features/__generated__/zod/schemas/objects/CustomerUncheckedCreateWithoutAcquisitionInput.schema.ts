import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceUncheckedCreateNestedManyWithoutCustomerInputObjectSchema as InvoiceUncheckedCreateNestedManyWithoutCustomerInputObjectSchema } from './InvoiceUncheckedCreateNestedManyWithoutCustomerInput.schema';
import { OrderUncheckedCreateNestedManyWithoutCustomerInputObjectSchema as OrderUncheckedCreateNestedManyWithoutCustomerInputObjectSchema } from './OrderUncheckedCreateNestedManyWithoutCustomerInput.schema';
import { ServiceRequestUncheckedCreateNestedManyWithoutCustomerInputObjectSchema as ServiceRequestUncheckedCreateNestedManyWithoutCustomerInputObjectSchema } from './ServiceRequestUncheckedCreateNestedManyWithoutCustomerInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  ward: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  userId: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  address: z.string().optional().nullable(),
  Invoice: z.lazy(() => InvoiceUncheckedCreateNestedManyWithoutCustomerInputObjectSchema).optional(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutCustomerInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutCustomerInputObjectSchema).optional()
}).strict();
export const CustomerUncheckedCreateWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.CustomerUncheckedCreateWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerUncheckedCreateWithoutAcquisitionInput>;
export const CustomerUncheckedCreateWithoutAcquisitionInputObjectZodSchema = makeSchema();
