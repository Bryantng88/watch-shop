import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceTypeSchema } from '../enums/ServiceType.schema';
import { ServiceRequestStatusSchema } from '../enums/ServiceRequestStatus.schema';
import { ServiceScopeSchema } from '../enums/ServiceScope.schema';
import { InvoiceCreateNestedManyWithoutServiceReqInputObjectSchema as InvoiceCreateNestedManyWithoutServiceReqInputObjectSchema } from './InvoiceCreateNestedManyWithoutServiceReqInput.schema';
import { MaintenanceRecordCreateNestedManyWithoutServiceRequestInputObjectSchema as MaintenanceRecordCreateNestedManyWithoutServiceRequestInputObjectSchema } from './MaintenanceRecordCreateNestedManyWithoutServiceRequestInput.schema';
import { OrderItemCreateNestedOneWithoutServiceRequestInputObjectSchema as OrderItemCreateNestedOneWithoutServiceRequestInputObjectSchema } from './OrderItemCreateNestedOneWithoutServiceRequestInput.schema';
import { ProductCreateNestedOneWithoutServiceRequestInputObjectSchema as ProductCreateNestedOneWithoutServiceRequestInputObjectSchema } from './ProductCreateNestedOneWithoutServiceRequestInput.schema';
import { ProductVariantCreateNestedOneWithoutServiceRequestInputObjectSchema as ProductVariantCreateNestedOneWithoutServiceRequestInputObjectSchema } from './ProductVariantCreateNestedOneWithoutServiceRequestInput.schema';
import { ServiceCatalogCreateNestedOneWithoutServiceRequestInputObjectSchema as ServiceCatalogCreateNestedOneWithoutServiceRequestInputObjectSchema } from './ServiceCatalogCreateNestedOneWithoutServiceRequestInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  type: ServiceTypeSchema.optional(),
  billable: z.boolean().optional(),
  brandSnapshot: z.string().optional().nullable(),
  modelSnapshot: z.string().optional().nullable(),
  refSnapshot: z.string().optional().nullable(),
  serialSnapshot: z.string().optional().nullable(),
  appointmentAt: z.coerce.date().optional().nullable(),
  status: ServiceRequestStatusSchema.optional(),
  notes: z.string().optional().nullable(),
  warrantyUntil: z.coerce.date().optional().nullable(),
  warrantyPolicy: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  refNo: z.string().optional().nullable(),
  scope: ServiceScopeSchema.optional().nullable(),
  Invoice: z.lazy(() => InvoiceCreateNestedManyWithoutServiceReqInputObjectSchema).optional(),
  maintenance: z.lazy(() => MaintenanceRecordCreateNestedManyWithoutServiceRequestInputObjectSchema).optional(),
  orderItem: z.lazy(() => OrderItemCreateNestedOneWithoutServiceRequestInputObjectSchema).optional(),
  product: z.lazy(() => ProductCreateNestedOneWithoutServiceRequestInputObjectSchema).optional(),
  variant: z.lazy(() => ProductVariantCreateNestedOneWithoutServiceRequestInputObjectSchema).optional(),
  ServiceCatalog: z.lazy(() => ServiceCatalogCreateNestedOneWithoutServiceRequestInputObjectSchema).optional()
}).strict();
export const ServiceRequestCreateWithoutCustomerInputObjectSchema: z.ZodType<Prisma.ServiceRequestCreateWithoutCustomerInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCreateWithoutCustomerInput>;
export const ServiceRequestCreateWithoutCustomerInputObjectZodSchema = makeSchema();
