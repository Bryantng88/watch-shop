import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectArgsObjectSchema as MediaObjectArgsObjectSchema } from './MediaObjectArgs.schema'

const makeSchema = () => z.object({
  mediaObject: z.union([z.boolean(), z.lazy(() => MediaObjectArgsObjectSchema)]).optional()
}).strict();
export const MediaOperationIncludeObjectSchema: z.ZodType<Prisma.MediaOperationInclude> = makeSchema() as unknown as z.ZodType<Prisma.MediaOperationInclude>;
export const MediaOperationIncludeObjectZodSchema = makeSchema();
