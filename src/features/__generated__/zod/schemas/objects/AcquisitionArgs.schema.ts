import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSelectObjectSchema as AcquisitionSelectObjectSchema } from './AcquisitionSelect.schema';
import { AcquisitionIncludeObjectSchema as AcquisitionIncludeObjectSchema } from './AcquisitionInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => AcquisitionSelectObjectSchema).optional(),
  include: z.lazy(() => AcquisitionIncludeObjectSchema).optional()
}).strict();
export const AcquisitionArgsObjectSchema = makeSchema();
export const AcquisitionArgsObjectZodSchema = makeSchema();
