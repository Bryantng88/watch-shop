import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecV2WhereInputObjectSchema as WatchSpecV2WhereInputObjectSchema } from './WatchSpecV2WhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => WatchSpecV2WhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => WatchSpecV2WhereInputObjectSchema).optional().nullable()
}).strict();
export const WatchSpecV2NullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.WatchSpecV2NullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecV2NullableScalarRelationFilter>;
export const WatchSpecV2NullableScalarRelationFilterObjectZodSchema = makeSchema();
