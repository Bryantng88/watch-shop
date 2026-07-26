import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProjectionEventDeliverySelectObjectSchema as ProjectionEventDeliverySelectObjectSchema } from './objects/ProjectionEventDeliverySelect.schema';
import { ProjectionEventDeliveryUpdateManyMutationInputObjectSchema as ProjectionEventDeliveryUpdateManyMutationInputObjectSchema } from './objects/ProjectionEventDeliveryUpdateManyMutationInput.schema';
import { ProjectionEventDeliveryWhereInputObjectSchema as ProjectionEventDeliveryWhereInputObjectSchema } from './objects/ProjectionEventDeliveryWhereInput.schema';

export const ProjectionEventDeliveryUpdateManyAndReturnSchema: z.ZodType<Prisma.ProjectionEventDeliveryUpdateManyAndReturnArgs> = z.object({ select: ProjectionEventDeliverySelectObjectSchema.optional(), data: ProjectionEventDeliveryUpdateManyMutationInputObjectSchema, where: ProjectionEventDeliveryWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryUpdateManyAndReturnArgs>;

export const ProjectionEventDeliveryUpdateManyAndReturnZodSchema = z.object({ select: ProjectionEventDeliverySelectObjectSchema.optional(), data: ProjectionEventDeliveryUpdateManyMutationInputObjectSchema, where: ProjectionEventDeliveryWhereInputObjectSchema.optional() }).strict();