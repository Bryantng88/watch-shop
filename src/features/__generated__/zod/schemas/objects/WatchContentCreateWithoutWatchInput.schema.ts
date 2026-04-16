import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchContentCreatebulletSpecsInputObjectSchema as WatchContentCreatebulletSpecsInputObjectSchema } from './WatchContentCreatebulletSpecsInput.schema';
import { NullableJsonNullValueInputSchema } from '../enums/NullableJsonNullValueInput.schema'

import { JsonValueSchema as jsonSchema } from '../../helpers/json-helpers';

const makeSchema = () => z.object({
  id: z.string().optional(),
  titleOverride: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  hookText: z.string().optional().nullable(),
  body: z.string().optional().nullable(),
  bulletSpecs: z.union([z.lazy(() => WatchContentCreatebulletSpecsInputObjectSchema), z.string().array()]).optional(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  aiMetaJson: z.union([NullableJsonNullValueInputSchema, jsonSchema]).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const WatchContentCreateWithoutWatchInputObjectSchema: z.ZodType<Prisma.WatchContentCreateWithoutWatchInput> = makeSchema() as unknown as z.ZodType<Prisma.WatchContentCreateWithoutWatchInput>;
export const WatchContentCreateWithoutWatchInputObjectZodSchema = makeSchema();
