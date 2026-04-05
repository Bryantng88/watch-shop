import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueCountOutputTypeSelectObjectSchema as TechnicalIssueCountOutputTypeSelectObjectSchema } from './TechnicalIssueCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TechnicalIssueCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const TechnicalIssueCountOutputTypeArgsObjectSchema = makeSchema();
export const TechnicalIssueCountOutputTypeArgsObjectZodSchema = makeSchema();
