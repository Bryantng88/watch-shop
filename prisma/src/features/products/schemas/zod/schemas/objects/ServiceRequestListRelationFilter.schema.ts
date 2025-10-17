import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => ServiceRequestWhereInputObjectSchema).optional(),
  some: z.lazy(() => ServiceRequestWhereInputObjectSchema).optional(),
  none: z.lazy(() => ServiceRequestWhereInputObjectSchema).optional()
}).strict();
export const ServiceRequestListRelationFilterObjectSchema: z.ZodType<Prisma.ServiceRequestListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestListRelationFilter>;
export const ServiceRequestListRelationFilterObjectZodSchema = makeSchema();
