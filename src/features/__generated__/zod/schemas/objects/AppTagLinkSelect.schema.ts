import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagArgsObjectSchema as AppTagArgsObjectSchema } from './AppTagArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  tagId: z.boolean().optional(),
  targetType: z.boolean().optional(),
  targetId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  tag: z.union([z.boolean(), z.lazy(() => AppTagArgsObjectSchema)]).optional()
}).strict();
export const AppTagLinkSelectObjectSchema: z.ZodType<Prisma.AppTagLinkSelect> = makeSchema() as unknown as z.ZodType<Prisma.AppTagLinkSelect>;
export const AppTagLinkSelectObjectZodSchema = makeSchema();
