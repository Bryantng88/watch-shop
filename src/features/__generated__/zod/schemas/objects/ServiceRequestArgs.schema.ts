import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestSelectObjectSchema as ServiceRequestSelectObjectSchema } from './ServiceRequestSelect.schema';
import { ServiceRequestIncludeObjectSchema as ServiceRequestIncludeObjectSchema } from './ServiceRequestInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ServiceRequestSelectObjectSchema).optional(),
  include: z.lazy(() => ServiceRequestIncludeObjectSchema).optional()
}).strict();
export const ServiceRequestArgsObjectSchema = makeSchema();
export const ServiceRequestArgsObjectZodSchema = makeSchema();
