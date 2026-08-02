import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchStrapInstallationSelectObjectSchema as WatchStrapInstallationSelectObjectSchema } from './objects/WatchStrapInstallationSelect.schema';
import { WatchStrapInstallationIncludeObjectSchema as WatchStrapInstallationIncludeObjectSchema } from './objects/WatchStrapInstallationInclude.schema';
import { WatchStrapInstallationUpdateInputObjectSchema as WatchStrapInstallationUpdateInputObjectSchema } from './objects/WatchStrapInstallationUpdateInput.schema';
import { WatchStrapInstallationUncheckedUpdateInputObjectSchema as WatchStrapInstallationUncheckedUpdateInputObjectSchema } from './objects/WatchStrapInstallationUncheckedUpdateInput.schema';
import { WatchStrapInstallationWhereUniqueInputObjectSchema as WatchStrapInstallationWhereUniqueInputObjectSchema } from './objects/WatchStrapInstallationWhereUniqueInput.schema';

export const WatchStrapInstallationUpdateOneSchema: z.ZodType<Prisma.WatchStrapInstallationUpdateArgs> = z.object({ select: WatchStrapInstallationSelectObjectSchema.optional(), include: WatchStrapInstallationIncludeObjectSchema.optional(), data: z.union([WatchStrapInstallationUpdateInputObjectSchema, WatchStrapInstallationUncheckedUpdateInputObjectSchema]), where: WatchStrapInstallationWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WatchStrapInstallationUpdateArgs>;

export const WatchStrapInstallationUpdateOneZodSchema = z.object({ select: WatchStrapInstallationSelectObjectSchema.optional(), include: WatchStrapInstallationIncludeObjectSchema.optional(), data: z.union([WatchStrapInstallationUpdateInputObjectSchema, WatchStrapInstallationUncheckedUpdateInputObjectSchema]), where: WatchStrapInstallationWhereUniqueInputObjectSchema }).strict();