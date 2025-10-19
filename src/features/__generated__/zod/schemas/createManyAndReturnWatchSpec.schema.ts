import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSpecSelectObjectSchema as WatchSpecSelectObjectSchema } from './objects/WatchSpecSelect.schema';
import { WatchSpecCreateManyInputObjectSchema as WatchSpecCreateManyInputObjectSchema } from './objects/WatchSpecCreateManyInput.schema';

export const WatchSpecCreateManyAndReturnSchema: z.ZodType<Prisma.WatchSpecCreateManyAndReturnArgs> = z.object({ select: WatchSpecSelectObjectSchema.optional(), data: z.union([ WatchSpecCreateManyInputObjectSchema, z.array(WatchSpecCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WatchSpecCreateManyAndReturnArgs>;

export const WatchSpecCreateManyAndReturnZodSchema = z.object({ select: WatchSpecSelectObjectSchema.optional(), data: z.union([ WatchSpecCreateManyInputObjectSchema, z.array(WatchSpecCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();