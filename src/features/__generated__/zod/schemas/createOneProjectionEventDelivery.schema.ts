import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProjectionEventDeliverySelectObjectSchema as ProjectionEventDeliverySelectObjectSchema } from './objects/ProjectionEventDeliverySelect.schema';
import { ProjectionEventDeliveryIncludeObjectSchema as ProjectionEventDeliveryIncludeObjectSchema } from './objects/ProjectionEventDeliveryInclude.schema';
import { ProjectionEventDeliveryCreateInputObjectSchema as ProjectionEventDeliveryCreateInputObjectSchema } from './objects/ProjectionEventDeliveryCreateInput.schema';
import { ProjectionEventDeliveryUncheckedCreateInputObjectSchema as ProjectionEventDeliveryUncheckedCreateInputObjectSchema } from './objects/ProjectionEventDeliveryUncheckedCreateInput.schema';

export const ProjectionEventDeliveryCreateOneSchema: z.ZodType<Prisma.ProjectionEventDeliveryCreateArgs> = z.object({ select: ProjectionEventDeliverySelectObjectSchema.optional(), include: ProjectionEventDeliveryIncludeObjectSchema.optional(), data: z.union([ProjectionEventDeliveryCreateInputObjectSchema, ProjectionEventDeliveryUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryCreateArgs>;

export const ProjectionEventDeliveryCreateOneZodSchema = z.object({ select: ProjectionEventDeliverySelectObjectSchema.optional(), include: ProjectionEventDeliveryIncludeObjectSchema.optional(), data: z.union([ProjectionEventDeliveryCreateInputObjectSchema, ProjectionEventDeliveryUncheckedCreateInputObjectSchema]) }).strict();