import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceDetailSchema } from '../enums/ServiceDetail.schema';
import { NestedEnumServiceDetailFilterObjectSchema as NestedEnumServiceDetailFilterObjectSchema } from './NestedEnumServiceDetailFilter.schema'

const makeSchema = () => z.object({
  equals: ServiceDetailSchema.optional(),
  in: ServiceDetailSchema.array().optional(),
  notIn: ServiceDetailSchema.array().optional(),
  not: z.union([ServiceDetailSchema, z.lazy(() => NestedEnumServiceDetailFilterObjectSchema)]).optional()
}).strict();
export const EnumServiceDetailFilterObjectSchema: z.ZodType<Prisma.EnumServiceDetailFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumServiceDetailFilter>;
export const EnumServiceDetailFilterObjectZodSchema = makeSchema();
