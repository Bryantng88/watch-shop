import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NotificationRuleSelectObjectSchema as NotificationRuleSelectObjectSchema } from './NotificationRuleSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => NotificationRuleSelectObjectSchema).optional()
}).strict();
export const NotificationRuleArgsObjectSchema = makeSchema();
export const NotificationRuleArgsObjectZodSchema = makeSchema();
