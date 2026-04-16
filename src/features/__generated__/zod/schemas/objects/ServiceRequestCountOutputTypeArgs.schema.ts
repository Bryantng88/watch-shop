import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceRequestCountOutputTypeSelectObjectSchema as ServiceRequestCountOutputTypeSelectObjectSchema } from './ServiceRequestCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ServiceRequestCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const ServiceRequestCountOutputTypeArgsObjectSchema = makeSchema();
export const ServiceRequestCountOutputTypeArgsObjectZodSchema = makeSchema();
