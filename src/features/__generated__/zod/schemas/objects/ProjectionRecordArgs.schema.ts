import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProjectionRecordSelectObjectSchema as ProjectionRecordSelectObjectSchema } from './ProjectionRecordSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ProjectionRecordSelectObjectSchema).optional()
}).strict();
export const ProjectionRecordArgsObjectSchema = makeSchema();
export const ProjectionRecordArgsObjectZodSchema = makeSchema();
