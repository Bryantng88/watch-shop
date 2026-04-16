import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { TechnicalIssueSelectObjectSchema as TechnicalIssueSelectObjectSchema } from './TechnicalIssueSelect.schema';
import { TechnicalIssueIncludeObjectSchema as TechnicalIssueIncludeObjectSchema } from './TechnicalIssueInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => TechnicalIssueSelectObjectSchema).optional(),
  include: z.lazy(() => TechnicalIssueIncludeObjectSchema).optional()
}).strict();
export const TechnicalIssueArgsObjectSchema = makeSchema();
export const TechnicalIssueArgsObjectZodSchema = makeSchema();
