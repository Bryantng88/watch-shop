import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceDetailSchema } from '../enums/ServiceDetail.schema'

const nestedenumservicedetailfilterSchema = z.object({
  equals: ServiceDetailSchema.optional(),
  in: ServiceDetailSchema.array().optional(),
  notIn: ServiceDetailSchema.array().optional(),
  not: z.union([ServiceDetailSchema, z.lazy(() => NestedEnumServiceDetailFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumServiceDetailFilterObjectSchema: z.ZodType<Prisma.NestedEnumServiceDetailFilter> = nestedenumservicedetailfilterSchema as unknown as z.ZodType<Prisma.NestedEnumServiceDetailFilter>;
export const NestedEnumServiceDetailFilterObjectZodSchema = nestedenumservicedetailfilterSchema;
