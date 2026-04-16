import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecWhereInputObjectSchema as WatchSpecWhereInputObjectSchema } from './WatchSpecWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => WatchSpecWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => WatchSpecWhereInputObjectSchema).optional().nullable()
}).strict();
export const WatchSpecNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.WatchSpecNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecNullableScalarRelationFilter>;
export const WatchSpecNullableScalarRelationFilterObjectZodSchema = makeSchema();
