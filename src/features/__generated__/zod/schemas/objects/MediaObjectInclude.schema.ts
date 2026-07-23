import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaBindingFindManySchema as MediaBindingFindManySchema } from '../findManyMediaBinding.schema';
import { MediaOperationFindManySchema as MediaOperationFindManySchema } from '../findManyMediaOperation.schema';
import { MediaObjectCountOutputTypeArgsObjectSchema as MediaObjectCountOutputTypeArgsObjectSchema } from './MediaObjectCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  bindings: z.union([z.boolean(), z.lazy(() => MediaBindingFindManySchema)]).optional(),
  operations: z.union([z.boolean(), z.lazy(() => MediaOperationFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => MediaObjectCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const MediaObjectIncludeObjectSchema: z.ZodType<Prisma.MediaObjectInclude> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectInclude>;
export const MediaObjectIncludeObjectZodSchema = makeSchema();
