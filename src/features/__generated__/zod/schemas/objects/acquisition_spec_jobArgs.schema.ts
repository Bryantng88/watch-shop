import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { acquisition_spec_jobSelectObjectSchema as acquisition_spec_jobSelectObjectSchema } from './acquisition_spec_jobSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => acquisition_spec_jobSelectObjectSchema).optional()
}).strict();
export const acquisition_spec_jobArgsObjectSchema = makeSchema();
export const acquisition_spec_jobArgsObjectZodSchema = makeSchema();
