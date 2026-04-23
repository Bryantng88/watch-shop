import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  acquisitionSpecJobId: z.string(),
  acquisitionItemId: z.string(),
  acquisitionId: z.string().optional().nullable(),
  productId: z.string().optional().nullable(),
  stage: z.string(),
  level: z.string().optional(),
  message: z.string(),
  payload: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional()
}).strict();
export const AcquisitionSpecJobLogUncheckedCreateInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobLogUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogUncheckedCreateInput>;
export const AcquisitionSpecJobLogUncheckedCreateInputObjectZodSchema = makeSchema();
