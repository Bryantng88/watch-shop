import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionSpecJobArgsObjectSchema as AcquisitionSpecJobArgsObjectSchema } from './AcquisitionSpecJobArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  acquisitionSpecJobId: z.boolean().optional(),
  acquisitionItemId: z.boolean().optional(),
  acquisitionId: z.boolean().optional(),
  productId: z.boolean().optional(),
  stage: z.boolean().optional(),
  level: z.boolean().optional(),
  message: z.boolean().optional(),
  payload: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  acquisitionSpecJob: z.union([z.boolean(), z.lazy(() => AcquisitionSpecJobArgsObjectSchema)]).optional()
}).strict();
export const AcquisitionSpecJobLogSelectObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobLogSelect> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogSelect>;
export const AcquisitionSpecJobLogSelectObjectZodSchema = makeSchema();
