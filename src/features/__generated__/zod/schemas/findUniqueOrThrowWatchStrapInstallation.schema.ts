import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchStrapInstallationSelectObjectSchema as WatchStrapInstallationSelectObjectSchema } from './objects/WatchStrapInstallationSelect.schema';
import { WatchStrapInstallationIncludeObjectSchema as WatchStrapInstallationIncludeObjectSchema } from './objects/WatchStrapInstallationInclude.schema';
import { WatchStrapInstallationWhereUniqueInputObjectSchema as WatchStrapInstallationWhereUniqueInputObjectSchema } from './objects/WatchStrapInstallationWhereUniqueInput.schema';

export const WatchStrapInstallationFindUniqueOrThrowSchema: z.ZodType<Prisma.WatchStrapInstallationFindUniqueOrThrowArgs> = z.object({ select: WatchStrapInstallationSelectObjectSchema.optional(), include: WatchStrapInstallationIncludeObjectSchema.optional(), where: WatchStrapInstallationWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WatchStrapInstallationFindUniqueOrThrowArgs>;

export const WatchStrapInstallationFindUniqueOrThrowZodSchema = z.object({ select: WatchStrapInstallationSelectObjectSchema.optional(), include: WatchStrapInstallationIncludeObjectSchema.optional(), where: WatchStrapInstallationWhereUniqueInputObjectSchema }).strict();