import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { BusinessEventLogArgsObjectSchema as BusinessEventLogArgsObjectSchema } from './BusinessEventLogArgs.schema'

const makeSchema = () => z.object({
  businessEventLog: z.union([z.boolean(), z.lazy(() => BusinessEventLogArgsObjectSchema)]).optional()
}).strict();
export const ProjectionEventDeliveryIncludeObjectSchema: z.ZodType<Prisma.ProjectionEventDeliveryInclude> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryInclude>;
export const ProjectionEventDeliveryIncludeObjectZodSchema = makeSchema();
