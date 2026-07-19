import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  projectionKey: z.string(),
  rowKey: z.string()
}).strict();
export const ProjectionRecordProjectionKeyRowKeyCompoundUniqueInputObjectSchema: z.ZodType<Prisma.ProjectionRecordProjectionKeyRowKeyCompoundUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionRecordProjectionKeyRowKeyCompoundUniqueInput>;
export const ProjectionRecordProjectionKeyRowKeyCompoundUniqueInputObjectZodSchema = makeSchema();
