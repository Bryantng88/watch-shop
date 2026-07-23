import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaBindingWhereInputObjectSchema as MediaBindingWhereInputObjectSchema } from './MediaBindingWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => MediaBindingWhereInputObjectSchema).optional(),
  some: z.lazy(() => MediaBindingWhereInputObjectSchema).optional(),
  none: z.lazy(() => MediaBindingWhereInputObjectSchema).optional()
}).strict();
export const MediaBindingListRelationFilterObjectSchema: z.ZodType<Prisma.MediaBindingListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.MediaBindingListRelationFilter>;
export const MediaBindingListRelationFilterObjectZodSchema = makeSchema();
