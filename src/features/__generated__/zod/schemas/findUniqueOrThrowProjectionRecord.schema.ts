import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProjectionRecordSelectObjectSchema as ProjectionRecordSelectObjectSchema } from './objects/ProjectionRecordSelect.schema';
import { ProjectionRecordWhereUniqueInputObjectSchema as ProjectionRecordWhereUniqueInputObjectSchema } from './objects/ProjectionRecordWhereUniqueInput.schema';

export const ProjectionRecordFindUniqueOrThrowSchema: z.ZodType<Prisma.ProjectionRecordFindUniqueOrThrowArgs> = z.object({ select: ProjectionRecordSelectObjectSchema.optional(),  where: ProjectionRecordWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ProjectionRecordFindUniqueOrThrowArgs>;

export const ProjectionRecordFindUniqueOrThrowZodSchema = z.object({ select: ProjectionRecordSelectObjectSchema.optional(),  where: ProjectionRecordWhereUniqueInputObjectSchema }).strict();