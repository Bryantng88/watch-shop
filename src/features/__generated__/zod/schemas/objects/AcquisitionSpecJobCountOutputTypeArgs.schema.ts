import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobCountOutputTypeSelectObjectSchema as AcquisitionSpecJobCountOutputTypeSelectObjectSchema } from './AcquisitionSpecJobCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => AcquisitionSpecJobCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const AcquisitionSpecJobCountOutputTypeArgsObjectSchema = makeSchema();
export const AcquisitionSpecJobCountOutputTypeArgsObjectZodSchema = makeSchema();
