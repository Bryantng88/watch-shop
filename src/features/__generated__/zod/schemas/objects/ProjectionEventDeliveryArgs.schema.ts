import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProjectionEventDeliverySelectObjectSchema as ProjectionEventDeliverySelectObjectSchema } from './ProjectionEventDeliverySelect.schema';
import { ProjectionEventDeliveryIncludeObjectSchema as ProjectionEventDeliveryIncludeObjectSchema } from './ProjectionEventDeliveryInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ProjectionEventDeliverySelectObjectSchema).optional(),
  include: z.lazy(() => ProjectionEventDeliveryIncludeObjectSchema).optional()
}).strict();
export const ProjectionEventDeliveryArgsObjectSchema = makeSchema();
export const ProjectionEventDeliveryArgsObjectZodSchema = makeSchema();
