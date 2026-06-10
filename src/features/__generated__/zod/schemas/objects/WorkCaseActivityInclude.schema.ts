import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseArgsObjectSchema as WorkCaseArgsObjectSchema } from './WorkCaseArgs.schema';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema'

const makeSchema = () => z.object({
  workCase: z.union([z.boolean(), z.lazy(() => WorkCaseArgsObjectSchema)]).optional(),
  actor: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional()
}).strict();
export const WorkCaseActivityIncludeObjectSchema: z.ZodType<Prisma.WorkCaseActivityInclude> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityInclude>;
export const WorkCaseActivityIncludeObjectZodSchema = makeSchema();
