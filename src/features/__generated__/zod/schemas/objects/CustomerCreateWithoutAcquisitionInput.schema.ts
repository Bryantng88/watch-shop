import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UserCreateNestedOneWithoutCustomerInputObjectSchema as UserCreateNestedOneWithoutCustomerInputObjectSchema } from './UserCreateNestedOneWithoutCustomerInput.schema';
import { InvoiceCreateNestedManyWithoutCustomerInputObjectSchema as InvoiceCreateNestedManyWithoutCustomerInputObjectSchema } from './InvoiceCreateNestedManyWithoutCustomerInput.schema';
import { OrderCreateNestedManyWithoutCustomerInputObjectSchema as OrderCreateNestedManyWithoutCustomerInputObjectSchema } from './OrderCreateNestedManyWithoutCustomerInput.schema';
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
<<<<<<< HEAD
=======
  district: z.string().optional().nullable(),
>>>>>>> 4f6d70506e71757ff795315d849e6d5ac7fcf052
  user: z.lazy(() => UserCreateNestedOneWithoutCustomerInputObjectSchema).optional(),
  Invoice: z.lazy(() => InvoiceCreateNestedManyWithoutCustomerInputObjectSchema).optional(),
  orders: z.lazy(() => OrderCreateNestedManyWithoutCustomerInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestCreateNestedManyWithoutCustomerInputObjectSchema).optional()
}).strict();
export const CustomerCreateWithoutAcquisitionInputObjectSchema: z.ZodType<Prisma.CustomerCreateWithoutAcquisitionInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerCreateWithoutAcquisitionInput>;
export const CustomerCreateWithoutAcquisitionInputObjectZodSchema = makeSchema();
