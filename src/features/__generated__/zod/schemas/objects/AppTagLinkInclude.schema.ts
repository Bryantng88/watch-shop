import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagArgsObjectSchema as AppTagArgsObjectSchema } from './AppTagArgs.schema'

const makeSchema = () => z.object({
  tag: z.union([z.boolean(), z.lazy(() => AppTagArgsObjectSchema)]).optional()
}).strict();
export const AppTagLinkIncludeObjectSchema: z.ZodType<Prisma.AppTagLinkInclude> = makeSchema() as unknown as z.ZodType<Prisma.AppTagLinkInclude>;
export const AppTagLinkIncludeObjectZodSchema = makeSchema();
