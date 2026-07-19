import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProjectionRecordSelectObjectSchema as ProjectionRecordSelectObjectSchema } from './objects/ProjectionRecordSelect.schema';
import { ProjectionRecordCreateManyInputObjectSchema as ProjectionRecordCreateManyInputObjectSchema } from './objects/ProjectionRecordCreateManyInput.schema';

export const ProjectionRecordCreateManyAndReturnSchema: z.ZodType<Prisma.ProjectionRecordCreateManyAndReturnArgs> = z.object({ select: ProjectionRecordSelectObjectSchema.optional(), data: z.union([ ProjectionRecordCreateManyInputObjectSchema, z.array(ProjectionRecordCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ProjectionRecordCreateManyAndReturnArgs>;

export const ProjectionRecordCreateManyAndReturnZodSchema = z.object({ select: ProjectionRecordSelectObjectSchema.optional(), data: z.union([ ProjectionRecordCreateManyInputObjectSchema, z.array(ProjectionRecordCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();