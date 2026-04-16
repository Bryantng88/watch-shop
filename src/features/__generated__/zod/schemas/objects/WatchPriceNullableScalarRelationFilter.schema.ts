import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchPriceWhereInputObjectSchema as WatchPriceWhereInputObjectSchema } from './WatchPriceWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => WatchPriceWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => WatchPriceWhereInputObjectSchema).optional().nullable()
}).strict();
export const WatchPriceNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.WatchPriceNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WatchPriceNullableScalarRelationFilter>;
export const WatchPriceNullableScalarRelationFilterObjectZodSchema = makeSchema();
