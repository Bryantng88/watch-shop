import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProjectionEventDeliveryUpdateManyMutationInputObjectSchema as ProjectionEventDeliveryUpdateManyMutationInputObjectSchema } from './objects/ProjectionEventDeliveryUpdateManyMutationInput.schema';
import { ProjectionEventDeliveryWhereInputObjectSchema as ProjectionEventDeliveryWhereInputObjectSchema } from './objects/ProjectionEventDeliveryWhereInput.schema';

export const ProjectionEventDeliveryUpdateManySchema: z.ZodType<Prisma.ProjectionEventDeliveryUpdateManyArgs> = z.object({ data: ProjectionEventDeliveryUpdateManyMutationInputObjectSchema, where: ProjectionEventDeliveryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryUpdateManyArgs>;

export const ProjectionEventDeliveryUpdateManyZodSchema = z.object({ data: ProjectionEventDeliveryUpdateManyMutationInputObjectSchema, where: ProjectionEventDeliveryWhereInputObjectSchema.optional() }).strict();