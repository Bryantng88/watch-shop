import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchArgsObjectSchema as WatchArgsObjectSchema } from './WatchArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  watchId: z.boolean().optional(),
  legacyProductImageId: z.boolean().optional(),
  key: z.boolean().optional(),
  url: z.boolean().optional(),
  type: z.boolean().optional(),
  role: z.boolean().optional(),
  sortOrder: z.boolean().optional(),
  alt: z.boolean().optional(),
  width: z.boolean().optional(),
  height: z.boolean().optional(),
  mime: z.boolean().optional(),
  sizeBytes: z.boolean().optional(),
  dominantHex: z.boolean().optional(),
  contentHash: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  watch: z.union([z.boolean(), z.lazy(() => WatchArgsObjectSchema)]).optional()
}).strict();
export const WatchMediaSelectObjectSchema: z.ZodType<Prisma.WatchMediaSelect> = makeSchema() as unknown as z.ZodType<Prisma.WatchMediaSelect>;
export const WatchMediaSelectObjectZodSchema = makeSchema();
