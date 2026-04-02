import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ApprovalRequestsCountOutputTypeSelectObjectSchema as ApprovalRequestsCountOutputTypeSelectObjectSchema } from './ApprovalRequestsCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => ApprovalRequestsCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const ApprovalRequestsCountOutputTypeArgsObjectSchema = makeSchema();
export const ApprovalRequestsCountOutputTypeArgsObjectZodSchema = makeSchema();
