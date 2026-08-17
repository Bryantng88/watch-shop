import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StorefrontHeroImageSelectObjectSchema as StorefrontHeroImageSelectObjectSchema } from './StorefrontHeroImageSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => StorefrontHeroImageSelectObjectSchema).optional()
}).strict();
export const StorefrontHeroImageArgsObjectSchema = makeSchema();
export const StorefrontHeroImageArgsObjectZodSchema = makeSchema();
