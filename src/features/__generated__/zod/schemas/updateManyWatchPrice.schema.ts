import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchPriceUpdateManyMutationInputObjectSchema as WatchPriceUpdateManyMutationInputObjectSchema } from './objects/WatchPriceUpdateManyMutationInput.schema';
import { WatchPriceWhereInputObjectSchema as WatchPriceWhereInputObjectSchema } from './objects/WatchPriceWhereInput.schema';

export const WatchPriceUpdateManySchema: z.ZodType<Prisma.WatchPriceUpdateManyArgs> = z.object({ data: WatchPriceUpdateManyMutationInputObjectSchema, where: WatchPriceWhereInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.WatchPriceUpdateManyArgs>;

export const WatchPriceUpdateManyZodSchema = z.object({ data: WatchPriceUpdateManyMutationInputObjectSchema, where: WatchPriceWhereInputObjectSchema.optional() }).strict();