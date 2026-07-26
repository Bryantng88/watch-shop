import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProjectionEventDeliverySelectObjectSchema as ProjectionEventDeliverySelectObjectSchema } from './objects/ProjectionEventDeliverySelect.schema';
import { ProjectionEventDeliveryIncludeObjectSchema as ProjectionEventDeliveryIncludeObjectSchema } from './objects/ProjectionEventDeliveryInclude.schema';
import { ProjectionEventDeliveryWhereUniqueInputObjectSchema as ProjectionEventDeliveryWhereUniqueInputObjectSchema } from './objects/ProjectionEventDeliveryWhereUniqueInput.schema';

export const ProjectionEventDeliveryFindUniqueOrThrowSchema: z.ZodType<Prisma.ProjectionEventDeliveryFindUniqueOrThrowArgs> = z.object({ select: ProjectionEventDeliverySelectObjectSchema.optional(), include: ProjectionEventDeliveryIncludeObjectSchema.optional(), where: ProjectionEventDeliveryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryFindUniqueOrThrowArgs>;

export const ProjectionEventDeliveryFindUniqueOrThrowZodSchema = z.object({ select: ProjectionEventDeliverySelectObjectSchema.optional(), include: ProjectionEventDeliveryIncludeObjectSchema.optional(), where: ProjectionEventDeliveryWhereUniqueInputObjectSchema }).strict();