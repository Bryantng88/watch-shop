import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectArgsObjectSchema as MediaObjectArgsObjectSchema } from './MediaObjectArgs.schema'

const makeSchema = () => z.object({
  mediaObject: z.union([z.boolean(), z.lazy(() => MediaObjectArgsObjectSchema)]).optional()
}).strict();
export const MediaBindingIncludeObjectSchema: z.ZodType<Prisma.MediaBindingInclude> = makeSchema() as unknown as z.ZodType<Prisma.MediaBindingInclude>;
export const MediaBindingIncludeObjectZodSchema = makeSchema();
