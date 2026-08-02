import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchStrapInstallationCreateManyInputObjectSchema as WatchStrapInstallationCreateManyInputObjectSchema } from './objects/WatchStrapInstallationCreateManyInput.schema';

export const WatchStrapInstallationCreateManySchema: z.ZodType<Prisma.WatchStrapInstallationCreateManyArgs> = z.object({ data: z.union([ WatchStrapInstallationCreateManyInputObjectSchema, z.array(WatchStrapInstallationCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WatchStrapInstallationCreateManyArgs>;

export const WatchStrapInstallationCreateManyZodSchema = z.object({ data: z.union([ WatchStrapInstallationCreateManyInputObjectSchema, z.array(WatchStrapInstallationCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();