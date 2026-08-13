import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierRequestStatusSchema } from '../enums/CarrierRequestStatus.schema'

const nestedenumcarrierrequeststatusfilterSchema = z.object({
  equals: CarrierRequestStatusSchema.optional(),
  in: CarrierRequestStatusSchema.array().optional(),
  notIn: CarrierRequestStatusSchema.array().optional(),
  not: z.union([CarrierRequestStatusSchema, z.lazy(() => NestedEnumCarrierRequestStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumCarrierRequestStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumCarrierRequestStatusFilter> = nestedenumcarrierrequeststatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumCarrierRequestStatusFilter>;
export const NestedEnumCarrierRequestStatusFilterObjectZodSchema = nestedenumcarrierrequeststatusfilterSchema;
