import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionCountOutputTypeSelectObjectSchema as AcquisitionCountOutputTypeSelectObjectSchema } from './AcquisitionCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => AcquisitionCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const AcquisitionCountOutputTypeArgsObjectSchema = makeSchema();
export const AcquisitionCountOutputTypeArgsObjectZodSchema = makeSchema();
