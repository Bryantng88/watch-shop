import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemArgsObjectSchema as AcquisitionItemArgsObjectSchema } from './AcquisitionItemArgs.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  acquisitionItemId: z.boolean().optional(),
  productId: z.boolean().optional(),
  status: z.boolean().optional(),
  attempts: z.boolean().optional(),
  lastError: z.boolean().optional(),
  startedAt: z.boolean().optional(),
  finishedAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  runAfter: z.boolean().optional(),
  priority: z.boolean().optional(),
  acquisitionItem: z.union([z.boolean(), z.lazy(() => AcquisitionItemArgsObjectSchema)]).optional(),
  Product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional()
}).strict();
export const AcquisitionSpecJobSelectObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobSelect> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobSelect>;
export const AcquisitionSpecJobSelectObjectZodSchema = makeSchema();
