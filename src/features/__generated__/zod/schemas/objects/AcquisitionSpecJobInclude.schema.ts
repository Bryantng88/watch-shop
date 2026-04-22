import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemArgsObjectSchema as AcquisitionItemArgsObjectSchema } from './AcquisitionItemArgs.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema'

const makeSchema = () => z.object({
  acquisitionItem: z.union([z.boolean(), z.lazy(() => AcquisitionItemArgsObjectSchema)]).optional(),
  Product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional()
}).strict();
export const AcquisitionSpecJobIncludeObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobInclude> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobInclude>;
export const AcquisitionSpecJobIncludeObjectZodSchema = makeSchema();
