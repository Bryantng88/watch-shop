import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateNestedOneWithoutAcquisitionSpecJobInputObjectSchema as ProductCreateNestedOneWithoutAcquisitionSpecJobInputObjectSchema } from './ProductCreateNestedOneWithoutAcquisitionSpecJobInput.schema';
import { AcquisitionSpecJobLogCreateNestedManyWithoutAcquisitionSpecJobInputObjectSchema as AcquisitionSpecJobLogCreateNestedManyWithoutAcquisitionSpecJobInputObjectSchema } from './AcquisitionSpecJobLogCreateNestedManyWithoutAcquisitionSpecJobInput.schema'

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
  product: z.lazy(() => ProductCreateNestedOneWithoutAcquisitionSpecJobInputObjectSchema),
  logs: z.lazy(() => AcquisitionSpecJobLogCreateNestedManyWithoutAcquisitionSpecJobInputObjectSchema).optional()
}).strict();
export const AcquisitionSpecJobCreateWithoutAcquisitionItemInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobCreateWithoutAcquisitionItemInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobCreateWithoutAcquisitionItemInput>;
export const AcquisitionSpecJobCreateWithoutAcquisitionItemInputObjectZodSchema = makeSchema();
