import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestStatusSchema } from '../enums/ServiceRequestStatus.schema';
import { NestedEnumServiceRequestStatusFilterObjectSchema as NestedEnumServiceRequestStatusFilterObjectSchema } from './NestedEnumServiceRequestStatusFilter.schema'

const makeSchema = () => z.object({
  equals: ServiceRequestStatusSchema.optional(),
  in: ServiceRequestStatusSchema.array().optional(),
  notIn: ServiceRequestStatusSchema.array().optional(),
  not: z.union([ServiceRequestStatusSchema, z.lazy(() => NestedEnumServiceRequestStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumServiceRequestStatusFilterObjectSchema: z.ZodType<Prisma.EnumServiceRequestStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumServiceRequestStatusFilter>;
export const EnumServiceRequestStatusFilterObjectZodSchema = makeSchema();
