import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CarrierRequestStatusSchema } from '../enums/CarrierRequestStatus.schema';
import { NestedEnumCarrierRequestStatusFilterObjectSchema as NestedEnumCarrierRequestStatusFilterObjectSchema } from './NestedEnumCarrierRequestStatusFilter.schema'

const makeSchema = () => z.object({
  equals: CarrierRequestStatusSchema.optional(),
  in: CarrierRequestStatusSchema.array().optional(),
  notIn: CarrierRequestStatusSchema.array().optional(),
  not: z.union([CarrierRequestStatusSchema, z.lazy(() => NestedEnumCarrierRequestStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumCarrierRequestStatusFilterObjectSchema: z.ZodType<Prisma.EnumCarrierRequestStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumCarrierRequestStatusFilter>;
export const EnumCarrierRequestStatusFilterObjectZodSchema = makeSchema();
