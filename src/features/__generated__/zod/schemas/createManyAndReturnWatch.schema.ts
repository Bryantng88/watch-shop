import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSelectObjectSchema as WatchSelectObjectSchema } from './objects/WatchSelect.schema';
import { WatchCreateManyInputObjectSchema as WatchCreateManyInputObjectSchema } from './objects/WatchCreateManyInput.schema';

export const WatchCreateManyAndReturnSchema: z.ZodType<Prisma.WatchCreateManyAndReturnArgs> = z.object({ select: WatchSelectObjectSchema.optional(), data: z.union([ WatchCreateManyInputObjectSchema, z.array(WatchCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WatchCreateManyAndReturnArgs>;

export const WatchCreateManyAndReturnZodSchema = z.object({ select: WatchSelectObjectSchema.optional(), data: z.union([ WatchCreateManyInputObjectSchema, z.array(WatchCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();