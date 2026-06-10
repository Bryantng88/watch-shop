import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseArgsObjectSchema as WorkCaseArgsObjectSchema } from './WorkCaseArgs.schema';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  workCaseId: z.boolean().optional(),
  actorId: z.boolean().optional(),
  action: z.boolean().optional(),
  note: z.boolean().optional(),
  metadata: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  workCase: z.union([z.boolean(), z.lazy(() => WorkCaseArgsObjectSchema)]).optional(),
  actor: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional()
}).strict();
export const WorkCaseActivitySelectObjectSchema: z.ZodType<Prisma.WorkCaseActivitySelect> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivitySelect>;
export const WorkCaseActivitySelectObjectZodSchema = makeSchema();
