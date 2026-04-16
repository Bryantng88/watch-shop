import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => WatchWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => WatchWhereInputObjectSchema).optional().nullable()
}).strict();
export const WatchNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.WatchNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WatchNullableScalarRelationFilter>;
export const WatchNullableScalarRelationFilterObjectZodSchema = makeSchema();
