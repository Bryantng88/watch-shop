import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => ServiceRequestWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => ServiceRequestWhereInputObjectSchema).optional()
}).strict();
export const ServiceRequestScalarRelationFilterObjectSchema: z.ZodType<Prisma.ServiceRequestScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestScalarRelationFilter>;
export const ServiceRequestScalarRelationFilterObjectZodSchema = makeSchema();
