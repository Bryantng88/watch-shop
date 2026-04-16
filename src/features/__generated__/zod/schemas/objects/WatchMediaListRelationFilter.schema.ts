import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchMediaWhereInputObjectSchema as WatchMediaWhereInputObjectSchema } from './WatchMediaWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => WatchMediaWhereInputObjectSchema).optional(),
  some: z.lazy(() => WatchMediaWhereInputObjectSchema).optional(),
  none: z.lazy(() => WatchMediaWhereInputObjectSchema).optional()
}).strict();
export const WatchMediaListRelationFilterObjectSchema: z.ZodType<Prisma.WatchMediaListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WatchMediaListRelationFilter>;
export const WatchMediaListRelationFilterObjectZodSchema = makeSchema();
