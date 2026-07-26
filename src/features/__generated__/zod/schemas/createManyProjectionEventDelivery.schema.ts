import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProjectionEventDeliveryCreateManyInputObjectSchema as ProjectionEventDeliveryCreateManyInputObjectSchema } from './objects/ProjectionEventDeliveryCreateManyInput.schema';

export const ProjectionEventDeliveryCreateManySchema: z.ZodType<Prisma.ProjectionEventDeliveryCreateManyArgs> = z.object({ data: z.union([ ProjectionEventDeliveryCreateManyInputObjectSchema, z.array(ProjectionEventDeliveryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryCreateManyArgs>;

export const ProjectionEventDeliveryCreateManyZodSchema = z.object({ data: z.union([ ProjectionEventDeliveryCreateManyInputObjectSchema, z.array(ProjectionEventDeliveryCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();