import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestStatusSchema } from '../enums/ServiceRequestStatus.schema'

const nestedenumservicerequeststatusfilterSchema = z.object({
  equals: ServiceRequestStatusSchema.optional(),
  in: ServiceRequestStatusSchema.array().optional(),
  notIn: ServiceRequestStatusSchema.array().optional(),
  not: z.union([ServiceRequestStatusSchema, z.lazy(() => NestedEnumServiceRequestStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumServiceRequestStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumServiceRequestStatusFilter> = nestedenumservicerequeststatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumServiceRequestStatusFilter>;
export const NestedEnumServiceRequestStatusFilterObjectZodSchema = nestedenumservicerequeststatusfilterSchema;
