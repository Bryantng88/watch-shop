import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemCreateNestedOneWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionItemCreateNestedOneWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionItemCreateNestedOneWithoutAcquisitionSpecJobInput.schema';
import { ProductCreateNestedOneWithoutAcquisitionSpecJobInputObjectSchema as ProductCreateNestedOneWithoutAcquisitionSpecJobInputObjectSchema } from './ProductCreateNestedOneWithoutAcquisitionSpecJobInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  status: z.string().optional(),
  attempts: z.number().int().optional(),
  lastError: z.string().optional().nullable(),
  startedAt: z.coerce.date().optional().nullable(),
  finishedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  runAfter: z.coerce.date().optional().nullable(),
  priority: z.number().int().optional(),
  acquisitionItem: z.lazy(() => AcquisitionItemCreateNestedOneWithoutAcquisitionSpecJobInputObjectSchema),
  Product: z.lazy(() => ProductCreateNestedOneWithoutAcquisitionSpecJobInputObjectSchema)
}).strict();
export const AcquisitionSpecJobCreateInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobCreateInput>;
export const AcquisitionSpecJobCreateInputObjectZodSchema = makeSchema();
