import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionCreateNestedManyWithoutCustomerInputObjectSchema as AcquisitionCreateNestedManyWithoutCustomerInputObjectSchema } from './AcquisitionCreateNestedManyWithoutCustomerInput.schema';
import { UserCreateNestedOneWithoutCustomerInputObjectSchema as UserCreateNestedOneWithoutCustomerInputObjectSchema } from './UserCreateNestedOneWithoutCustomerInput.schema';
import { InvoiceCreateNestedManyWithoutCustomerInputObjectSchema as InvoiceCreateNestedManyWithoutCustomerInputObjectSchema } from './InvoiceCreateNestedManyWithoutCustomerInput.schema';
import { ServiceRequestCreateNestedManyWithoutCustomerInputObjectSchema as ServiceRequestCreateNestedManyWithoutCustomerInputObjectSchema } from './ServiceRequestCreateNestedManyWithoutCustomerInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().optional().nullable(),
  phone: z.string().max(32).optional().nullable(),
  ward: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  address: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  Acquisition: z.lazy(() => AcquisitionCreateNestedManyWithoutCustomerInputObjectSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutCustomerInputObjectSchema).optional(),
  Invoice: z.lazy(() => InvoiceCreateNestedManyWithoutCustomerInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestCreateNestedManyWithoutCustomerInputObjectSchema).optional()
}).strict();
export const CustomerCreateWithoutOrdersInputObjectSchema: z.ZodType<Prisma.CustomerCreateWithoutOrdersInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerCreateWithoutOrdersInput>;
export const CustomerCreateWithoutOrdersInputObjectZodSchema = makeSchema();
