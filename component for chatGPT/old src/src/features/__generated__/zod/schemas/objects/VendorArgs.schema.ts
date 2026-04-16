import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorSelectObjectSchema as VendorSelectObjectSchema } from './VendorSelect.schema';
import { VendorIncludeObjectSchema as VendorIncludeObjectSchema } from './VendorInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => VendorSelectObjectSchema).optional(),
  include: z.lazy(() => VendorIncludeObjectSchema).optional()
}).strict();
export const VendorArgsObjectSchema = makeSchema();
export const VendorArgsObjectZodSchema = makeSchema();
