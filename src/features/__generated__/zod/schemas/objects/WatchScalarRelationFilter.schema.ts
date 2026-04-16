import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './WatchWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => WatchWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => WatchWhereInputObjectSchema).optional()
}).strict();
export const WatchScalarRelationFilterObjectSchema: z.ZodType<Prisma.WatchScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WatchScalarRelationFilter>;
export const WatchScalarRelationFilterObjectZodSchema = makeSchema();
