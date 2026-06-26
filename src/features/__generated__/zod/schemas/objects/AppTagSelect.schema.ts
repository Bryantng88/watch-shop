import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagLinkFindManySchema as AppTagLinkFindManySchema } from '../findManyAppTagLink.schema';
import { AppTagCountOutputTypeArgsObjectSchema as AppTagCountOutputTypeArgsObjectSchema } from './AppTagCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  slug: z.boolean().optional(),
  color: z.boolean().optional(),
  scope: z.boolean().optional(),
  ownerType: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  links: z.union([z.boolean(), z.lazy(() => AppTagLinkFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => AppTagCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const AppTagSelectObjectSchema: z.ZodType<Prisma.AppTagSelect> = makeSchema() as unknown as z.ZodType<Prisma.AppTagSelect>;
export const AppTagSelectObjectZodSchema = makeSchema();
