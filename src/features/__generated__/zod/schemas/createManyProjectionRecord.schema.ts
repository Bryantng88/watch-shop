import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProjectionRecordCreateManyInputObjectSchema as ProjectionRecordCreateManyInputObjectSchema } from './objects/ProjectionRecordCreateManyInput.schema';

export const ProjectionRecordCreateManySchema: z.ZodType<Prisma.ProjectionRecordCreateManyArgs> = z.object({ data: z.union([ ProjectionRecordCreateManyInputObjectSchema, z.array(ProjectionRecordCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.ProjectionRecordCreateManyArgs>;

export const ProjectionRecordCreateManyZodSchema = z.object({ data: z.union([ ProjectionRecordCreateManyInputObjectSchema, z.array(ProjectionRecordCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();