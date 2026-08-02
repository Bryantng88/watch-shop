import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchStrapInstallationSelectObjectSchema as WatchStrapInstallationSelectObjectSchema } from './objects/WatchStrapInstallationSelect.schema';
import { WatchStrapInstallationCreateManyInputObjectSchema as WatchStrapInstallationCreateManyInputObjectSchema } from './objects/WatchStrapInstallationCreateManyInput.schema';

export const WatchStrapInstallationCreateManyAndReturnSchema: z.ZodType<Prisma.WatchStrapInstallationCreateManyAndReturnArgs> = z.object({ select: WatchStrapInstallationSelectObjectSchema.optional(), data: z.union([ WatchStrapInstallationCreateManyInputObjectSchema, z.array(WatchStrapInstallationCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WatchStrapInstallationCreateManyAndReturnArgs>;

export const WatchStrapInstallationCreateManyAndReturnZodSchema = z.object({ select: WatchStrapInstallationSelectObjectSchema.optional(), data: z.union([ WatchStrapInstallationCreateManyInputObjectSchema, z.array(WatchStrapInstallationCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();