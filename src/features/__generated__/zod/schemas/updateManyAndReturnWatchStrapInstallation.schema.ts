import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchStrapInstallationSelectObjectSchema as WatchStrapInstallationSelectObjectSchema } from './objects/WatchStrapInstallationSelect.schema';
import { WatchStrapInstallationUpdateManyMutationInputObjectSchema as WatchStrapInstallationUpdateManyMutationInputObjectSchema } from './objects/WatchStrapInstallationUpdateManyMutationInput.schema';
import { WatchStrapInstallationWhereInputObjectSchema as WatchStrapInstallationWhereInputObjectSchema } from './objects/WatchStrapInstallationWhereInput.schema';

export const WatchStrapInstallationUpdateManyAndReturnSchema: z.ZodType<Prisma.WatchStrapInstallationUpdateManyAndReturnArgs> = z.object({ select: WatchStrapInstallationSelectObjectSchema.optional(), data: WatchStrapInstallationUpdateManyMutationInputObjectSchema, where: WatchStrapInstallationWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchStrapInstallationUpdateManyAndReturnArgs>;

export const WatchStrapInstallationUpdateManyAndReturnZodSchema = z.object({ select: WatchStrapInstallationSelectObjectSchema.optional(), data: WatchStrapInstallationUpdateManyMutationInputObjectSchema, where: WatchStrapInstallationWhereInputObjectSchema.optional() }).strict();