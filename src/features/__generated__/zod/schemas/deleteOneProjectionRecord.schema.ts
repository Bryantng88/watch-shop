import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProjectionRecordSelectObjectSchema as ProjectionRecordSelectObjectSchema } from './objects/ProjectionRecordSelect.schema';
import { ProjectionRecordWhereUniqueInputObjectSchema as ProjectionRecordWhereUniqueInputObjectSchema } from './objects/ProjectionRecordWhereUniqueInput.schema';

export const ProjectionRecordDeleteOneSchema: z.ZodType<Prisma.ProjectionRecordDeleteArgs> = z.object({ select: ProjectionRecordSelectObjectSchema.optional(),  where: ProjectionRecordWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ProjectionRecordDeleteArgs>;

export const ProjectionRecordDeleteOneZodSchema = z.object({ select: ProjectionRecordSelectObjectSchema.optional(),  where: ProjectionRecordWhereUniqueInputObjectSchema }).strict();