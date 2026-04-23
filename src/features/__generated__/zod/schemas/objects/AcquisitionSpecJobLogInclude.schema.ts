import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobArgsObjectSchema as AcquisitionSpecJobArgsObjectSchema } from './AcquisitionSpecJobArgs.schema'

const makeSchema = () => z.object({
  acquisitionSpecJob: z.union([z.boolean(), z.lazy(() => AcquisitionSpecJobArgsObjectSchema)]).optional()
}).strict();
export const AcquisitionSpecJobLogIncludeObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobLogInclude> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogInclude>;
export const AcquisitionSpecJobLogIncludeObjectZodSchema = makeSchema();
