import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProjectionRecordSelectObjectSchema as ProjectionRecordSelectObjectSchema } from './objects/ProjectionRecordSelect.schema';
import { ProjectionRecordWhereUniqueInputObjectSchema as ProjectionRecordWhereUniqueInputObjectSchema } from './objects/ProjectionRecordWhereUniqueInput.schema';
import { ProjectionRecordCreateInputObjectSchema as ProjectionRecordCreateInputObjectSchema } from './objects/ProjectionRecordCreateInput.schema';
import { ProjectionRecordUncheckedCreateInputObjectSchema as ProjectionRecordUncheckedCreateInputObjectSchema } from './objects/ProjectionRecordUncheckedCreateInput.schema';
import { ProjectionRecordUpdateInputObjectSchema as ProjectionRecordUpdateInputObjectSchema } from './objects/ProjectionRecordUpdateInput.schema';
import { ProjectionRecordUncheckedUpdateInputObjectSchema as ProjectionRecordUncheckedUpdateInputObjectSchema } from './objects/ProjectionRecordUncheckedUpdateInput.schema';

export const ProjectionRecordUpsertOneSchema: z.ZodType<Prisma.ProjectionRecordUpsertArgs> = z.object({ select: ProjectionRecordSelectObjectSchema.optional(),  where: ProjectionRecordWhereUniqueInputObjectSchema, create: z.union([ ProjectionRecordCreateInputObjectSchema, ProjectionRecordUncheckedCreateInputObjectSchema ]), update: z.union([ ProjectionRecordUpdateInputObjectSchema, ProjectionRecordUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.ProjectionRecordUpsertArgs>;

export const ProjectionRecordUpsertOneZodSchema = z.object({ select: ProjectionRecordSelectObjectSchema.optional(),  where: ProjectionRecordWhereUniqueInputObjectSchema, create: z.union([ ProjectionRecordCreateInputObjectSchema, ProjectionRecordUncheckedCreateInputObjectSchema ]), update: z.union([ ProjectionRecordUpdateInputObjectSchema, ProjectionRecordUncheckedUpdateInputObjectSchema ]) }).strict();