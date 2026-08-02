import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchStrapInstallationWhereInputObjectSchema as WatchStrapInstallationWhereInputObjectSchema } from './objects/WatchStrapInstallationWhereInput.schema';

export const WatchStrapInstallationDeleteManySchema: z.ZodType<Prisma.WatchStrapInstallationDeleteManyArgs> = z.object({ where: WatchStrapInstallationWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchStrapInstallationDeleteManyArgs>;

export const WatchStrapInstallationDeleteManyZodSchema = z.object({ where: WatchStrapInstallationWhereInputObjectSchema.optional() }).strict();