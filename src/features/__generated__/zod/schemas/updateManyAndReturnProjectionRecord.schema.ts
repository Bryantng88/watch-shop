import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProjectionRecordSelectObjectSchema as ProjectionRecordSelectObjectSchema } from './objects/ProjectionRecordSelect.schema';
import { ProjectionRecordUpdateManyMutationInputObjectSchema as ProjectionRecordUpdateManyMutationInputObjectSchema } from './objects/ProjectionRecordUpdateManyMutationInput.schema';
import { ProjectionRecordWhereInputObjectSchema as ProjectionRecordWhereInputObjectSchema } from './objects/ProjectionRecordWhereInput.schema';

export const ProjectionRecordUpdateManyAndReturnSchema: z.ZodType<Prisma.ProjectionRecordUpdateManyAndReturnArgs> = z.object({ select: ProjectionRecordSelectObjectSchema.optional(), data: ProjectionRecordUpdateManyMutationInputObjectSchema, where: ProjectionRecordWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.ProjectionRecordUpdateManyAndReturnArgs>;

export const ProjectionRecordUpdateManyAndReturnZodSchema = z.object({ select: ProjectionRecordSelectObjectSchema.optional(), data: ProjectionRecordUpdateManyMutationInputObjectSchema, where: ProjectionRecordWhereInputObjectSchema.optional() }).strict();