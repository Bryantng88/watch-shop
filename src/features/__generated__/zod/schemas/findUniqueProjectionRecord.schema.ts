import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProjectionRecordSelectObjectSchema as ProjectionRecordSelectObjectSchema } from './objects/ProjectionRecordSelect.schema';
import { ProjectionRecordWhereUniqueInputObjectSchema as ProjectionRecordWhereUniqueInputObjectSchema } from './objects/ProjectionRecordWhereUniqueInput.schema';

export const ProjectionRecordFindUniqueSchema: z.ZodType<Prisma.ProjectionRecordFindUniqueArgs> = z.object({ select: ProjectionRecordSelectObjectSchema.optional(),  where: ProjectionRecordWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.ProjectionRecordFindUniqueArgs>;

export const ProjectionRecordFindUniqueZodSchema = z.object({ select: ProjectionRecordSelectObjectSchema.optional(),  where: ProjectionRecordWhereUniqueInputObjectSchema }).strict();