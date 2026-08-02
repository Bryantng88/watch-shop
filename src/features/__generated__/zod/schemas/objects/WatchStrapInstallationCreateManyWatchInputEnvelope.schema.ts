import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapInstallationCreateManyWatchInputObjectSchema as WatchStrapInstallationCreateManyWatchInputObjectSchema } from './WatchStrapInstallationCreateManyWatchInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => WatchStrapInstallationCreateManyWatchInputObjectSchema), z.lazy(() => WatchStrapInstallationCreateManyWatchInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const WatchStrapInstallationCreateManyWatchInputEnvelopeObjectSchema: z.ZodType<Prisma.WatchStrapInstallationCreateManyWatchInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationCreateManyWatchInputEnvelope>;
export const WatchStrapInstallationCreateManyWatchInputEnvelopeObjectZodSchema = makeSchema();
