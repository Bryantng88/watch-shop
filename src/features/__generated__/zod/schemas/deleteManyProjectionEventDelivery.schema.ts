import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProjectionEventDeliveryWhereInputObjectSchema as ProjectionEventDeliveryWhereInputObjectSchema } from './objects/ProjectionEventDeliveryWhereInput.schema';

export const ProjectionEventDeliveryDeleteManySchema: z.ZodType<Prisma.ProjectionEventDeliveryDeleteManyArgs> = z.object({ where: ProjectionEventDeliveryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryDeleteManyArgs>;

export const ProjectionEventDeliveryDeleteManyZodSchema = z.object({ where: ProjectionEventDeliveryWhereInputObjectSchema.optional() }).strict();