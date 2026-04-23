import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemArgsObjectSchema as AcquisitionItemArgsObjectSchema } from './AcquisitionItemArgs.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { AcquisitionSpecJobLogFindManySchema as AcquisitionSpecJobLogFindManySchema } from '../findManyAcquisitionSpecJobLog.schema';
import { AcquisitionSpecJobCountOutputTypeArgsObjectSchema as AcquisitionSpecJobCountOutputTypeArgsObjectSchema } from './AcquisitionSpecJobCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  acquisitionItem: z.union([z.boolean(), z.lazy(() => AcquisitionItemArgsObjectSchema)]).optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  logs: z.union([z.boolean(), z.lazy(() => AcquisitionSpecJobLogFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => AcquisitionSpecJobCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const AcquisitionSpecJobIncludeObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobInclude> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobInclude>;
export const AcquisitionSpecJobIncludeObjectZodSchema = makeSchema();
