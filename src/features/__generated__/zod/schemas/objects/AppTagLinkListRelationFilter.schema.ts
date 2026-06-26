import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagLinkWhereInputObjectSchema as AppTagLinkWhereInputObjectSchema } from './AppTagLinkWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => AppTagLinkWhereInputObjectSchema).optional(),
  some: z.lazy(() => AppTagLinkWhereInputObjectSchema).optional(),
  none: z.lazy(() => AppTagLinkWhereInputObjectSchema).optional()
}).strict();
export const AppTagLinkListRelationFilterObjectSchema: z.ZodType<Prisma.AppTagLinkListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.AppTagLinkListRelationFilter>;
export const AppTagLinkListRelationFilterObjectZodSchema = makeSchema();
