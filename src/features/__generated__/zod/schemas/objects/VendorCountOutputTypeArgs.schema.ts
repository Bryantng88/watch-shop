import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorCountOutputTypeSelectObjectSchema as VendorCountOutputTypeSelectObjectSchema } from './VendorCountOutputTypeSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => VendorCountOutputTypeSelectObjectSchema).optional()
}).strict();
export const VendorCountOutputTypeArgsObjectSchema = makeSchema();
export const VendorCountOutputTypeArgsObjectZodSchema = makeSchema();
