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
  updatedAt: z.coerce.date().optional(),
  updatedBy: z.string().optional().nullable()
}).strict();
export const SystemJobControlUncheckedCreateInputObjectSchema: z.ZodType<Prisma.SystemJobControlUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobControlUncheckedCreateInput>;
export const SystemJobControlUncheckedCreateInputObjectZodSchema = makeSchema();
