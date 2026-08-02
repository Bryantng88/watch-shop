import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapInstallationSelectObjectSchema as WatchStrapInstallationSelectObjectSchema } from './WatchStrapInstallationSelect.schema';
import { WatchStrapInstallationIncludeObjectSchema as WatchStrapInstallationIncludeObjectSchema } from './WatchStrapInstallationInclude.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => WatchStrapInstallationSelectObjectSchema).optional(),
  include: z.lazy(() => WatchStrapInstallationIncludeObjectSchema).optional()
}).strict();
export const WatchStrapInstallationArgsObjectSchema = makeSchema();
export const WatchStrapInstallationArgsObjectZodSchema = makeSchema();
