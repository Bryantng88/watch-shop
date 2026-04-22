import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  processorKey: z.string(),
  triggerSource: z.string(),
  status: z.string(),
  processedCount: z.number().int().optional(),
  errorCount: z.number().int().optional(),
  note: z.string().optional().nullable(),
  detail: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  startedAt: z.coerce.date().optional(),
  finishedAt: z.coerce.date().optional().nullable()
}).strict();
export const SystemJobRunLogUncheckedCreateInputObjectSchema: z.ZodType<Prisma.SystemJobRunLogUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobRunLogUncheckedCreateInput>;
export const SystemJobRunLogUncheckedCreateInputObjectZodSchema = makeSchema();
