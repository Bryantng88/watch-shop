import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapInstallationWhereInputObjectSchema as WatchStrapInstallationWhereInputObjectSchema } from './WatchStrapInstallationWhereInput.schema'

const makeSchema = () => z.object({
  every: z.lazy(() => WatchStrapInstallationWhereInputObjectSchema).optional(),
  some: z.lazy(() => WatchStrapInstallationWhereInputObjectSchema).optional(),
  none: z.lazy(() => WatchStrapInstallationWhereInputObjectSchema).optional()
}).strict();
export const WatchStrapInstallationListRelationFilterObjectSchema: z.ZodType<Prisma.WatchStrapInstallationListRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationListRelationFilter>;
export const WatchStrapInstallationListRelationFilterObjectZodSchema = makeSchema();
