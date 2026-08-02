import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  installedFullLinks: z.literal(true).optional(),
  installedHalfLinks: z.literal(true).optional(),
  spareFullLinks: z.literal(true).optional(),
  spareHalfLinks: z.literal(true).optional(),
  endLinkCount: z.literal(true).optional(),
  wristSizeMM: z.literal(true).optional()
}).strict();
export const WatchStrapInstallationSumAggregateInputObjectSchema: z.ZodType<Prisma.WatchStrapInstallationSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationSumAggregateInputType>;
export const WatchStrapInstallationSumAggregateInputObjectZodSchema = makeSchema();
