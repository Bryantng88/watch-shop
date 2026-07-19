import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProjectionRecordSelectObjectSchema as ProjectionRecordSelectObjectSchema } from './objects/ProjectionRecordSelect.schema';
import { ProjectionRecordCreateInputObjectSchema as ProjectionRecordCreateInputObjectSchema } from './objects/ProjectionRecordCreateInput.schema';
import { ProjectionRecordUncheckedCreateInputObjectSchema as ProjectionRecordUncheckedCreateInputObjectSchema } from './objects/ProjectionRecordUncheckedCreateInput.schema';

export const ProjectionRecordCreateOneSchema: z.ZodType<Prisma.ProjectionRecordCreateArgs> = z.object({ select: ProjectionRecordSelectObjectSchema.optional(),  data: z.union([ProjectionRecordCreateInputObjectSchema, ProjectionRecordUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.ProjectionRecordCreateArgs>;

export const ProjectionRecordCreateOneZodSchema = z.object({ select: ProjectionRecordSelectObjectSchema.optional(),  data: z.union([ProjectionRecordCreateInputObjectSchema, ProjectionRecordUncheckedCreateInputObjectSchema]) }).strict();