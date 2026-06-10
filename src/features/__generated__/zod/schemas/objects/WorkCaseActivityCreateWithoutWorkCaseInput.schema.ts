import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema';
import { UserCreateNestedOneWithoutWorkCaseActivitiesInputObjectSchema as UserCreateNestedOneWithoutWorkCaseActivitiesInputObjectSchema } from './UserCreateNestedOneWithoutWorkCaseActivitiesInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  action: z.string(),
  note: z.string().optional().nullable(),
  metadata: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  actor: z.lazy(() => UserCreateNestedOneWithoutWorkCaseActivitiesInputObjectSchema).optional()
}).strict();
export const WorkCaseActivityCreateWithoutWorkCaseInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityCreateWithoutWorkCaseInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityCreateWithoutWorkCaseInput>;
export const WorkCaseActivityCreateWithoutWorkCaseInputObjectZodSchema = makeSchema();
