import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProjectionRecordUpdateManyMutationInputObjectSchema as ProjectionRecordUpdateManyMutationInputObjectSchema } from './objects/ProjectionRecordUpdateManyMutationInput.schema';
import { ProjectionRecordWhereInputObjectSchema as ProjectionRecordWhereInputObjectSchema } from './objects/ProjectionRecordWhereInput.schema';

export const ProjectionRecordUpdateManySchema: z.ZodType<Prisma.ProjectionRecordUpdateManyArgs> = z.object({ data: ProjectionRecordUpdateManyMutationInputObjectSchema, where: ProjectionRecordWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProjectionRecordUpdateManyArgs>;

export const ProjectionRecordUpdateManyZodSchema = z.object({ data: ProjectionRecordUpdateManyMutationInputObjectSchema, where: ProjectionRecordWhereInputObjectSchema.optional() }).strict();