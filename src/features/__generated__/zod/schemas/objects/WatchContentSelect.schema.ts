import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchArgsObjectSchema as WatchArgsObjectSchema } from './WatchArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  watchId: z.boolean().optional(),
  titleOverride: z.boolean().optional(),
  summary: z.boolean().optional(),
  hookText: z.boolean().optional(),
  body: z.boolean().optional(),
  bulletSpecs: z.boolean().optional(),
  seoTitle: z.boolean().optional(),
  seoDescription: z.boolean().optional(),
  aiMetaJson: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  watch: z.union([z.boolean(), z.lazy(() => WatchArgsObjectSchema)]).optional()
}).strict();
export const WatchContentSelectObjectSchema: z.ZodType<Prisma.WatchContentSelect> = makeSchema() as unknown as z.ZodType<Prisma.WatchContentSelect>;
export const WatchContentSelectObjectZodSchema = makeSchema();
