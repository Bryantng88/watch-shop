import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProjectionRecordProjectionKeyRowKeyCompoundUniqueInputObjectSchema as ProjectionRecordProjectionKeyRowKeyCompoundUniqueInputObjectSchema } from './ProjectionRecordProjectionKeyRowKeyCompoundUniqueInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  projectionKey_rowKey: z.lazy(() => ProjectionRecordProjectionKeyRowKeyCompoundUniqueInputObjectSchema).optional()
}).strict();
export const ProjectionRecordWhereUniqueInputObjectSchema: z.ZodType<Prisma.ProjectionRecordWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionRecordWhereUniqueInput>;
export const ProjectionRecordWhereUniqueInputObjectZodSchema = makeSchema();
