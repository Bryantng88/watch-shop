import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { AcquisitionSpecJobOrderByWithRelationInputObjectSchema as AcquisitionSpecJobOrderByWithRelationInputObjectSchema } from './AcquisitionSpecJobOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  acquisitionSpecJobId: SortOrderSchema.optional(),
  acquisitionItemId: SortOrderSchema.optional(),
  acquisitionId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  productId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  stage: SortOrderSchema.optional(),
  level: SortOrderSchema.optional(),
  message: SortOrderSchema.optional(),
  payload: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  acquisitionSpecJob: z.lazy(() => AcquisitionSpecJobOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const AcquisitionSpecJobLogOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobLogOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogOrderByWithRelationInput>;
export const AcquisitionSpecJobLogOrderByWithRelationInputObjectZodSchema = makeSchema();
