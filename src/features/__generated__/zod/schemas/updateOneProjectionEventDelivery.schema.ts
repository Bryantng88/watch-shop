import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProjectionEventDeliverySelectObjectSchema as ProjectionEventDeliverySelectObjectSchema } from './objects/ProjectionEventDeliverySelect.schema';
import { ProjectionEventDeliveryIncludeObjectSchema as ProjectionEventDeliveryIncludeObjectSchema } from './objects/ProjectionEventDeliveryInclude.schema';
import { ProjectionEventDeliveryUpdateInputObjectSchema as ProjectionEventDeliveryUpdateInputObjectSchema } from './objects/ProjectionEventDeliveryUpdateInput.schema';
import { ProjectionEventDeliveryUncheckedUpdateInputObjectSchema as ProjectionEventDeliveryUncheckedUpdateInputObjectSchema } from './objects/ProjectionEventDeliveryUncheckedUpdateInput.schema';
import { ProjectionEventDeliveryWhereUniqueInputObjectSchema as ProjectionEventDeliveryWhereUniqueInputObjectSchema } from './objects/ProjectionEventDeliveryWhereUniqueInput.schema';

export const ProjectionEventDeliveryUpdateOneSchema: z.ZodType<Prisma.ProjectionEventDeliveryUpdateArgs> = z.object({ select: ProjectionEventDeliverySelectObjectSchema.optional(), include: ProjectionEventDeliveryIncludeObjectSchema.optional(), data: z.union([ProjectionEventDeliveryUpdateInputObjectSchema, ProjectionEventDeliveryUncheckedUpdateInputObjectSchema]), where: ProjectionEventDeliveryWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryUpdateArgs>;

export const ProjectionEventDeliveryUpdateOneZodSchema = z.object({ select: ProjectionEventDeliverySelectObjectSchema.optional(), include: ProjectionEventDeliveryIncludeObjectSchema.optional(), data: z.union([ProjectionEventDeliveryUpdateInputObjectSchema, ProjectionEventDeliveryUncheckedUpdateInputObjectSchema]), where: ProjectionEventDeliveryWhereUniqueInputObjectSchema }).strict();