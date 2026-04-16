import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { approvalRequestsSelectObjectSchema as approvalRequestsSelectObjectSchema } from './approvalRequestsSelect.schema';
import { approvalRequestsIncludeObjectSchema as approvalRequestsIncludeObjectSchema } from './approvalRequestsInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => approvalRequestsSelectObjectSchema).optional(),
  include: z.lazy(() => approvalRequestsIncludeObjectSchema).optional()
}).strict();
export const approvalRequestsArgsObjectSchema = makeSchema();
export const approvalRequestsArgsObjectZodSchema = makeSchema();
