import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  workCaseId: z.string(),
  actorId: z.string().optional().nullable(),
  action: z.string(),
  note: z.string().optional().nullable(),
  metadata: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional()
}).strict();
export const WorkCaseActivityUncheckedCreateInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityUncheckedCreateInput>;
export const WorkCaseActivityUncheckedCreateInputObjectZodSchema = makeSchema();
