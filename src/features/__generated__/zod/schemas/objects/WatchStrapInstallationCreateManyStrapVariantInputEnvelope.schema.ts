import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchStrapInstallationCreateManyStrapVariantInputObjectSchema as WatchStrapInstallationCreateManyStrapVariantInputObjectSchema } from './WatchStrapInstallationCreateManyStrapVariantInput.schema'

const makeSchema = () => z.object({
  data: z.union([z.lazy(() => WatchStrapInstallationCreateManyStrapVariantInputObjectSchema), z.lazy(() => WatchStrapInstallationCreateManyStrapVariantInputObjectSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
export const WatchStrapInstallationCreateManyStrapVariantInputEnvelopeObjectSchema: z.ZodType<Prisma.WatchStrapInstallationCreateManyStrapVariantInputEnvelope> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationCreateManyStrapVariantInputEnvelope>;
export const WatchStrapInstallationCreateManyStrapVariantInputEnvelopeObjectZodSchema = makeSchema();
