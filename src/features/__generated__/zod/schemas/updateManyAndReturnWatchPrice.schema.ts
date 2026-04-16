import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchPriceSelectObjectSchema as WatchPriceSelectObjectSchema } from './objects/WatchPriceSelect.schema';
import { WatchPriceUpdateManyMutationInputObjectSchema as WatchPriceUpdateManyMutationInputObjectSchema } from './objects/WatchPriceUpdateManyMutationInput.schema';
import { WatchPriceWhereInputObjectSchema as WatchPriceWhereInputObjectSchema } from './objects/WatchPriceWhereInput.schema';

export const WatchPriceUpdateManyAndReturnSchema: z.ZodType<Prisma.WatchPriceUpdateManyAndReturnArgs> = z.object({ select: WatchPriceSelectObjectSchema.optional(), data: WatchPriceUpdateManyMutationInputObjectSchema, where: WatchPriceWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchPriceUpdateManyAndReturnArgs>;

export const WatchPriceUpdateManyAndReturnZodSchema = z.object({ select: WatchPriceSelectObjectSchema.optional(), data: WatchPriceUpdateManyMutationInputObjectSchema, where: WatchPriceWhereInputObjectSchema.optional() }).strict();