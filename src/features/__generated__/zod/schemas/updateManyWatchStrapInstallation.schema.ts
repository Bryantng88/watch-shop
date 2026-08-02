import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchStrapInstallationUpdateManyMutationInputObjectSchema as WatchStrapInstallationUpdateManyMutationInputObjectSchema } from './objects/WatchStrapInstallationUpdateManyMutationInput.schema';
import { WatchStrapInstallationWhereInputObjectSchema as WatchStrapInstallationWhereInputObjectSchema } from './objects/WatchStrapInstallationWhereInput.schema';

export const WatchStrapInstallationUpdateManySchema: z.ZodType<Prisma.WatchStrapInstallationUpdateManyArgs> = z.object({ data: WatchStrapInstallationUpdateManyMutationInputObjectSchema, where: WatchStrapInstallationWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchStrapInstallationUpdateManyArgs>;

export const WatchStrapInstallationUpdateManyZodSchema = z.object({ data: WatchStrapInstallationUpdateManyMutationInputObjectSchema, where: WatchStrapInstallationWhereInputObjectSchema.optional() }).strict();