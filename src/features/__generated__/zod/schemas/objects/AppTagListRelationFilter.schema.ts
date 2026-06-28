import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagWhereInputObjectSchema as AppTagWhereInputObjectSchema } from './AppTagWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => AppTagWhereInputObjectSchema).optional(),
  some: z.lazy(() => AppTagWhereInputObjectSchema).optional(),
  none: z.lazy(() => AppTagWhereInputObjectSchema).optional()
}).strict();
export const AppTagListRelationFilterObjectSchema: z.ZodType<Prisma.AppTagListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.AppTagListRelationFilter>;
export const AppTagListRelationFilterObjectZodSchema = makeSchema();
