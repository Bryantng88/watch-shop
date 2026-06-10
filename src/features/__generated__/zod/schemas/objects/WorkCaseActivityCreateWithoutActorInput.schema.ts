import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { WorkCaseCreateNestedOneWithoutActivitiesInputObjectSchema as WorkCaseCreateNestedOneWithoutActivitiesInputObjectSchema } from './WorkCaseCreateNestedOneWithoutActivitiesInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  action: z.string(),
  note: z.string().optional().nullable(),
  metadata: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  workCase: z.lazy(() => WorkCaseCreateNestedOneWithoutActivitiesInputObjectSchema)
}).strict();
export const WorkCaseActivityCreateWithoutActorInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityCreateWithoutActorInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityCreateWithoutActorInput>;
export const WorkCaseActivityCreateWithoutActorInputObjectZodSchema = makeSchema();
