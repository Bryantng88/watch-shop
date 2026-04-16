import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchPriceSelectObjectSchema as WatchPriceSelectObjectSchema } from './objects/WatchPriceSelect.schema';
import { WatchPriceCreateManyInputObjectSchema as WatchPriceCreateManyInputObjectSchema } from './objects/WatchPriceCreateManyInput.schema';

export const WatchPriceCreateManyAndReturnSchema: z.ZodType<Prisma.WatchPriceCreateManyAndReturnArgs> = z.object({ select: WatchPriceSelectObjectSchema.optional(), data: z.union([ WatchPriceCreateManyInputObjectSchema, z.array(WatchPriceCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WatchPriceCreateManyAndReturnArgs>;

export const WatchPriceCreateManyAndReturnZodSchema = z.object({ select: WatchPriceSelectObjectSchema.optional(), data: z.union([ WatchPriceCreateManyInputObjectSchema, z.array(WatchPriceCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();