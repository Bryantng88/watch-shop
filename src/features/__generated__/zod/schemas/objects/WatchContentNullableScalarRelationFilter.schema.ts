import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchContentWhereInputObjectSchema as WatchContentWhereInputObjectSchema } from './WatchContentWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => WatchContentWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => WatchContentWhereInputObjectSchema).optional().nullable()
}).strict();
export const WatchContentNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.WatchContentNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WatchContentNullableScalarRelationFilter>;
export const WatchContentNullableScalarRelationFilterObjectZodSchema = makeSchema();
