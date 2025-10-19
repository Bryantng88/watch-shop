import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionCreateNestedManyWithoutCustomerInputObjectSchema as AcquisitionCreateNestedManyWithoutCustomerInputObjectSchema } from './AcquisitionCreateNestedManyWithoutCustomerInput.schema';
import { UserCreateNestedOneWithoutCustomerInputObjectSchema as UserCreateNestedOneWithoutCustomerInputObjectSchema } from './UserCreateNestedOneWithoutCustomerInput.schema';
import { InvoiceCreateNestedManyWithoutCustomerInputObjectSchema as InvoiceCreateNestedManyWithoutCustomerInputObjectSchema } from './InvoiceCreateNestedManyWithoutCustomerInput.schema';
import { OrderCreateNestedManyWithoutCustomerInputObjectSchema as OrderCreateNestedManyWithoutCustomerInputObjectSchema } from './OrderCreateNestedManyWithoutCustomerInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string().optional().nullable(),
  phone: z.string().max(32).optional().nullable(),
  ward: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  Acquisition: z.lazy(() => AcquisitionCreateNestedManyWithoutCustomerInputObjectSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutCustomerInputObjectSchema).optional(),
  Invoice: z.lazy(() => InvoiceCreateNestedManyWithoutCustomerInputObjectSchema).optional(),
  orders: z.lazy(() => OrderCreateNestedManyWithoutCustomerInputObjectSchema).optional()
}).strict();
export const CustomerCreateWithoutServiceRequestInputObjectSchema: z.ZodType<Prisma.CustomerCreateWithoutServiceRequestInput> = makeSchema() as unknown as z.ZodType<Prisma.CustomerCreateWithoutServiceRequestInput>;
export const CustomerCreateWithoutServiceRequestInputObjectZodSchema = makeSchema();
