import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => ServiceRequestWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => ServiceRequestWhereInputObjectSchema).optional().nullable()
}).strict();
export const ServiceRequestNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.ServiceRequestNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestNullableScalarRelationFilter>;
export const ServiceRequestNullableScalarRelationFilterObjectZodSchema = makeSchema();
