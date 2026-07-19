import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProjectionRecordSelectObjectSchema as ProjectionRecordSelectObjectSchema } from './objects/ProjectionRecordSelect.schema';
import { ProjectionRecordUpdateInputObjectSchema as ProjectionRecordUpdateInputObjectSchema } from './objects/ProjectionRecordUpdateInput.schema';
import { ProjectionRecordUncheckedUpdateInputObjectSchema as ProjectionRecordUncheckedUpdateInputObjectSchema } from './objects/ProjectionRecordUncheckedUpdateInput.schema';
import { ProjectionRecordWhereUniqueInputObjectSchema as ProjectionRecordWhereUniqueInputObjectSchema } from './objects/ProjectionRecordWhereUniqueInput.schema';

export const ProjectionRecordUpdateOneSchema: z.ZodType<Prisma.ProjectionRecordUpdateArgs> = z.object({ select: ProjectionRecordSelectObjectSchema.optional(),  data: z.union([ProjectionRecordUpdateInputObjectSchema, ProjectionRecordUncheckedUpdateInputObjectSchema]), where: ProjectionRecordWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ProjectionRecordUpdateArgs>;

export const ProjectionRecordUpdateOneZodSchema = z.object({ select: ProjectionRecordSelectObjectSchema.optional(),  data: z.union([ProjectionRecordUpdateInputObjectSchema, ProjectionRecordUncheckedUpdateInputObjectSchema]), where: ProjectionRecordWhereUniqueInputObjectSchema }).strict();