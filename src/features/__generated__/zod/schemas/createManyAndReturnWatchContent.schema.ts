import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchContentSelectObjectSchema as WatchContentSelectObjectSchema } from './objects/WatchContentSelect.schema';
import { WatchContentCreateManyInputObjectSchema as WatchContentCreateManyInputObjectSchema } from './objects/WatchContentCreateManyInput.schema';

export const WatchContentCreateManyAndReturnSchema: z.ZodType<Prisma.WatchContentCreateManyAndReturnArgs> = z.object({ select: WatchContentSelectObjectSchema.optional(), data: z.union([ WatchContentCreateManyInputObjectSchema, z.array(WatchContentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WatchContentCreateManyAndReturnArgs>;

export const WatchContentCreateManyAndReturnZodSchema = z.object({ select: WatchContentSelectObjectSchema.optional(), data: z.union([ WatchContentCreateManyInputObjectSchema, z.array(WatchContentCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();