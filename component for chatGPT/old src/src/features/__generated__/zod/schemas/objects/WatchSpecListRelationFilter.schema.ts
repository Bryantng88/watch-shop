import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchSpecWhereInputObjectSchema as WatchSpecWhereInputObjectSchema } from './WatchSpecWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => WatchSpecWhereInputObjectSchema).optional(),
  some: z.lazy(() => WatchSpecWhereInputObjectSchema).optional(),
  none: z.lazy(() => WatchSpecWhereInputObjectSchema).optional()
}).strict();
export const WatchSpecListRelationFilterObjectSchema: z.ZodType<Prisma.WatchSpecListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WatchSpecListRelationFilter>;
export const WatchSpecListRelationFilterObjectZodSchema = makeSchema();
