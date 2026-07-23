import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOperationWhereInputObjectSchema as MediaOperationWhereInputObjectSchema } from './MediaOperationWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => MediaOperationWhereInputObjectSchema).optional(),
  some: z.lazy(() => MediaOperationWhereInputObjectSchema).optional(),
  none: z.lazy(() => MediaOperationWhereInputObjectSchema).optional()
}).strict();
export const MediaOperationListRelationFilterObjectSchema: z.ZodType<Prisma.MediaOperationListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.MediaOperationListRelationFilter>;
export const MediaOperationListRelationFilterObjectZodSchema = makeSchema();
