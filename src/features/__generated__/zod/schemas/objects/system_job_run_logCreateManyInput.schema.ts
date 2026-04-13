import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  processor_key: z.string(),
  trigger_source: z.string(),
  status: z.string(),
  processed_count: z.number().int().optional(),
  error_count: z.number().int().optional(),
  note: z.string().optional().nullable(),
  detail: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  started_at: z.coerce.date().optional(),
  finished_at: z.coerce.date().optional().nullable()
}).strict();
export const system_job_run_logCreateManyInputObjectSchema: z.ZodType<Prisma.system_job_run_logCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.system_job_run_logCreateManyInput>;
export const system_job_run_logCreateManyInputObjectZodSchema = makeSchema();
