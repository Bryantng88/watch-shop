import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProjectionRecordWhereInputObjectSchema as ProjectionRecordWhereInputObjectSchema } from './objects/ProjectionRecordWhereInput.schema';

export const ProjectionRecordDeleteManySchema: z.ZodType<Prisma.ProjectionRecordDeleteManyArgs> = z.object({ where: ProjectionRecordWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProjectionRecordDeleteManyArgs>;

export const ProjectionRecordDeleteManyZodSchema = z.object({ where: ProjectionRecordWhereInputObjectSchema.optional() }).strict();