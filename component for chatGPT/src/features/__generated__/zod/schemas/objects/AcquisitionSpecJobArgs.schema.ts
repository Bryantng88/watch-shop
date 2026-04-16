import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobSelectObjectSchema as AcquisitionSpecJobSelectObjectSchema } from './AcquisitionSpecJobSelect.schema';
import { AcquisitionSpecJobIncludeObjectSchema as AcquisitionSpecJobIncludeObjectSchema } from './AcquisitionSpecJobInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => AcquisitionSpecJobSelectObjectSchema).optional(),
  include: z.lazy(() => AcquisitionSpecJobIncludeObjectSchema).optional()
}).strict();
export const AcquisitionSpecJobArgsObjectSchema = makeSchema();
export const AcquisitionSpecJobArgsObjectZodSchema = makeSchema();
