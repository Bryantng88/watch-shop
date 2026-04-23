import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobLogSelectObjectSchema as AcquisitionSpecJobLogSelectObjectSchema } from './AcquisitionSpecJobLogSelect.schema';
import { AcquisitionSpecJobLogIncludeObjectSchema as AcquisitionSpecJobLogIncludeObjectSchema } from './AcquisitionSpecJobLogInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => AcquisitionSpecJobLogSelectObjectSchema).optional(),
  include: z.lazy(() => AcquisitionSpecJobLogIncludeObjectSchema).optional()
}).strict();
export const AcquisitionSpecJobLogArgsObjectSchema = makeSchema();
export const AcquisitionSpecJobLogArgsObjectZodSchema = makeSchema();
