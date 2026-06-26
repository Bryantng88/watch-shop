import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagLinkFindManySchema as AppTagLinkFindManySchema } from '../findManyAppTagLink.schema';
import { AppTagCountOutputTypeArgsObjectSchema as AppTagCountOutputTypeArgsObjectSchema } from './AppTagCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  links: z.union([z.boolean(), z.lazy(() => AppTagLinkFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => AppTagCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const AppTagIncludeObjectSchema: z.ZodType<Prisma.AppTagInclude> = makeSchema() as unknown as z.ZodType<Prisma.AppTagInclude>;
export const AppTagIncludeObjectZodSchema = makeSchema();
