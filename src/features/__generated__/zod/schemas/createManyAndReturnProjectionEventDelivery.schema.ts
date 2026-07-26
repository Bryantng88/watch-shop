import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProjectionEventDeliverySelectObjectSchema as ProjectionEventDeliverySelectObjectSchema } from './objects/ProjectionEventDeliverySelect.schema';
import { ProjectionEventDeliveryCreateManyInputObjectSchema as ProjectionEventDeliveryCreateManyInputObjectSchema } from './objects/ProjectionEventDeliveryCreateManyInput.schema';

export const ProjectionEventDeliveryCreateManyAndReturnSchema: z.ZodType<Prisma.ProjectionEventDeliveryCreateManyAndReturnArgs> = z.object({ select: ProjectionEventDeliverySelectObjectSchema.optional(), data: z.union([ ProjectionEventDeliveryCreateManyInputObjectSchema, z.array(ProjectionEventDeliveryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryCreateManyAndReturnArgs>;

export const ProjectionEventDeliveryCreateManyAndReturnZodSchema = z.object({ select: ProjectionEventDeliverySelectObjectSchema.optional(), data: z.union([ ProjectionEventDeliveryCreateManyInputObjectSchema, z.array(ProjectionEventDeliveryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();