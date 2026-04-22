import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  key: z.string(),
  label: z.string(),
  enabled: z.boolean().optional(),
  batchSize: z.number().int().optional(),
  pausedReason: z.string().optional().nullable(),
  metadata: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  updated_at: z.coerce.date().optional(),
  updated_by: z.string().optional().nullable()
}).strict();
export const SystemJobControlCreateInputObjectSchema: z.ZodType<Prisma.SystemJobControlCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobControlCreateInput>;
export const SystemJobControlCreateInputObjectZodSchema = makeSchema();
