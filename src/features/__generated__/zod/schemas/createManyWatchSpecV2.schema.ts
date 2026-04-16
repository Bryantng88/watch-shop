import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSpecV2CreateManyInputObjectSchema as WatchSpecV2CreateManyInputObjectSchema } from './objects/WatchSpecV2CreateManyInput.schema';

export const WatchSpecV2CreateManySchema: z.ZodType<Prisma.WatchSpecV2CreateManyArgs> = z.object({ data: z.union([ WatchSpecV2CreateManyInputObjectSchema, z.array(WatchSpecV2CreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WatchSpecV2CreateManyArgs>;

export const WatchSpecV2CreateManyZodSchema = z.object({ data: z.union([ WatchSpecV2CreateManyInputObjectSchema, z.array(WatchSpecV2CreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();