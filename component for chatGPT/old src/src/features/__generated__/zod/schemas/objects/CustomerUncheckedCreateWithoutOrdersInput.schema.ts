import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionUncheckedCreateNestedManyWithoutCustomerInputObjectSchema as AcquisitionUncheckedCreateNestedManyWithoutCustomerInputObjectSchema } from './AcquisitionUncheckedCreateNestedManyWithoutCustomerInput.schema';
import { InvoiceUncheckedCreateNestedManyWithoutCustomerInputObjectSchema as InvoiceUncheckedCreateNestedManyWithoutCustomerInputObjectSchema } from './InvoiceUncheckedCreateNestedManyWithoutCustomerInput.schema';
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
  district: z.string().optional().nullable(),
  Acquisition: z.lazy(() => AcquisitionUncheckedCreateNestedManyWithoutCustomerInputObjectSchema).optional(),
  Invoice: z.lazy(() => InvoiceUncheckedCreateNestedManyWithoutCustomerInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestUncheckedCreateNestedManyWithoutCustomerInputObjectSchema).optional()
}).strict();
export const CustomerUncheckedCreateWithoutOrdersInputObjectSchema: z.ZodType<Prisma.CustomerUncheckedCreateWithoutOrdersInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerUncheckedCreateWithoutOrdersInput>;
export const CustomerUncheckedCreateWithoutOrdersInputObjectZodSchema = makeSchema();
