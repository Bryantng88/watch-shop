import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemSelectObjectSchema as AcquisitionItemSelectObjectSchema } from './AcquisitionItemSelect.schema';
import { AcquisitionItemIncludeObjectSchema as AcquisitionItemIncludeObjectSchema } from './AcquisitionItemInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => AcquisitionItemSelectObjectSchema).optional(),
  include: z.lazy(() => AcquisitionItemIncludeObjectSchema).optional()
}).strict();
export const AcquisitionItemArgsObjectSchema = makeSchema();
export const AcquisitionItemArgsObjectZodSchema = makeSchema();
