import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  key: z.string(),
  label: z.string(),
  enabled: z.boolean().optional(),
  batch_size: z.number().int().optional(),
  paused_reason: z.string().optional().nullable(),
  metadata: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  updated_at: z.coerce.date().optional(),
  updated_by: z.string().optional().nullable()
}).strict();
export const system_job_controlUncheckedCreateInputObjectSchema: z.ZodType<Prisma.system_job_controlUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.system_job_controlUncheckedCreateInput>;
export const system_job_controlUncheckedCreateInputObjectZodSchema = makeSchema();
