import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchPriceCreateManyInputObjectSchema as WatchPriceCreateManyInputObjectSchema } from './objects/WatchPriceCreateManyInput.schema';

export const WatchPriceCreateManySchema: z.ZodType<Prisma.WatchPriceCreateManyArgs> = z.object({ data: z.union([ WatchPriceCreateManyInputObjectSchema, z.array(WatchPriceCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict() as unknown as z.ZodType<Prisma.WatchPriceCreateManyArgs>;

export const WatchPriceCreateManyZodSchema = z.object({ data: z.union([ WatchPriceCreateManyInputObjectSchema, z.array(WatchPriceCreateManyInputObjectSchema) ]), skipDuplicates: z.boolean().optional() }).strict();