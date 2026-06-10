import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  workCaseId: z.string(),
  action: z.string(),
  note: z.string().optional().nullable(),
  metadata: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional()
}).strict();
export const WorkCaseActivityCreateManyActorInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityCreateManyActorInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityCreateManyActorInput>;
export const WorkCaseActivityCreateManyActorInputObjectZodSchema = makeSchema();
