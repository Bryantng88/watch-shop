import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProjectionEventDeliverySelectObjectSchema as ProjectionEventDeliverySelectObjectSchema } from './objects/ProjectionEventDeliverySelect.schema';
import { ProjectionEventDeliveryIncludeObjectSchema as ProjectionEventDeliveryIncludeObjectSchema } from './objects/ProjectionEventDeliveryInclude.schema';
import { ProjectionEventDeliveryWhereUniqueInputObjectSchema as ProjectionEventDeliveryWhereUniqueInputObjectSchema } from './objects/ProjectionEventDeliveryWhereUniqueInput.schema';

export const ProjectionEventDeliveryFindUniqueSchema: z.ZodType<Prisma.ProjectionEventDeliveryFindUniqueArgs> = z.object({ select: ProjectionEventDeliverySelectObjectSchema.optional(), include: ProjectionEventDeliveryIncludeObjectSchema.optional(), where: ProjectionEventDeliveryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryFindUniqueArgs>;

export const ProjectionEventDeliveryFindUniqueZodSchema = z.object({ select: ProjectionEventDeliverySelectObjectSchema.optional(), include: ProjectionEventDeliveryIncludeObjectSchema.optional(), where: ProjectionEventDeliveryWhereUniqueInputObjectSchema }).strict();