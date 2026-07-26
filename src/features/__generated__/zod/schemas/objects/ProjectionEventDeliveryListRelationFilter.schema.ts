import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProjectionEventDeliveryWhereInputObjectSchema as ProjectionEventDeliveryWhereInputObjectSchema } from './ProjectionEventDeliveryWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => ProjectionEventDeliveryWhereInputObjectSchema).optional(),
  some: z.lazy(() => ProjectionEventDeliveryWhereInputObjectSchema).optional(),
  none: z.lazy(() => ProjectionEventDeliveryWhereInputObjectSchema).optional()
}).strict();
export const ProjectionEventDeliveryListRelationFilterObjectSchema: z.ZodType<Prisma.ProjectionEventDeliveryListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryListRelationFilter>;
export const ProjectionEventDeliveryListRelationFilterObjectZodSchema = makeSchema();
