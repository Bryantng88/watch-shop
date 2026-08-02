import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchStrapInstallationSelectObjectSchema as WatchStrapInstallationSelectObjectSchema } from './objects/WatchStrapInstallationSelect.schema';
import { WatchStrapInstallationIncludeObjectSchema as WatchStrapInstallationIncludeObjectSchema } from './objects/WatchStrapInstallationInclude.schema';
import { WatchStrapInstallationCreateInputObjectSchema as WatchStrapInstallationCreateInputObjectSchema } from './objects/WatchStrapInstallationCreateInput.schema';
import { WatchStrapInstallationUncheckedCreateInputObjectSchema as WatchStrapInstallationUncheckedCreateInputObjectSchema } from './objects/WatchStrapInstallationUncheckedCreateInput.schema';

export const WatchStrapInstallationCreateOneSchema: z.ZodType<Prisma.WatchStrapInstallationCreateArgs> = z.object({ select: WatchStrapInstallationSelectObjectSchema.optional(), include: WatchStrapInstallationIncludeObjectSchema.optional(), data: z.union([WatchStrapInstallationCreateInputObjectSchema, WatchStrapInstallationUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.WatchStrapInstallationCreateArgs>;

export const WatchStrapInstallationCreateOneZodSchema = z.object({ select: WatchStrapInstallationSelectObjectSchema.optional(), include: WatchStrapInstallationIncludeObjectSchema.optional(), data: z.union([WatchStrapInstallationCreateInputObjectSchema, WatchStrapInstallationUncheckedCreateInputObjectSchema]) }).strict();