import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchArgsObjectSchema as WatchArgsObjectSchema } from './WatchArgs.schema';
import { ProductVariantArgsObjectSchema as ProductVariantArgsObjectSchema } from './ProductVariantArgs.schema'

const makeSchema = () => z.object({
  watch: z.union([z.boolean(), z.lazy(() => WatchArgsObjectSchema)]).optional(),
  strapVariant: z.union([z.boolean(), z.lazy(() => ProductVariantArgsObjectSchema)]).optional()
}).strict();
export const WatchStrapInstallationIncludeObjectSchema: z.ZodType<Prisma.WatchStrapInstallationInclude> = makeSchema() as unknown as z.ZodType<Prisma.WatchStrapInstallationInclude>;
export const WatchStrapInstallationIncludeObjectZodSchema = makeSchema();
