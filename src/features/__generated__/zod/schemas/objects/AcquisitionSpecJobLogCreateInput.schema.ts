import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { AcquisitionSpecJobCreateNestedOneWithoutLogsInputObjectSchema as AcquisitionSpecJobCreateNestedOneWithoutLogsInputObjectSchema } from './AcquisitionSpecJobCreateNestedOneWithoutLogsInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  acquisitionItemId: z.string(),
  acquisitionId: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  stage: z.string(),
  level: z.string().optional(),
  message: z.string(),
  payload: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  acquisitionSpecJob: z.lazy(() => AcquisitionSpecJobCreateNestedOneWithoutLogsInputObjectSchema)
}).strict();
export const AcquisitionSpecJobLogCreateInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobLogCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogCreateInput>;
export const AcquisitionSpecJobLogCreateInputObjectZodSchema = makeSchema();
