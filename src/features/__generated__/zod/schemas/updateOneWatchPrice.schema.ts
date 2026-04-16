import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchPriceSelectObjectSchema as WatchPriceSelectObjectSchema } from './objects/WatchPriceSelect.schema';
import { WatchPriceIncludeObjectSchema as WatchPriceIncludeObjectSchema } from './objects/WatchPriceInclude.schema';
import { WatchPriceUpdateInputObjectSchema as WatchPriceUpdateInputObjectSchema } from './objects/WatchPriceUpdateInput.schema';
import { WatchPriceUncheckedUpdateInputObjectSchema as WatchPriceUncheckedUpdateInputObjectSchema } from './objects/WatchPriceUncheckedUpdateInput.schema';
import { WatchPriceWhereUniqueInputObjectSchema as WatchPriceWhereUniqueInputObjectSchema } from './objects/WatchPriceWhereUniqueInput.schema';

export const WatchPriceUpdateOneSchema: z.ZodType<Prisma.WatchPriceUpdateArgs> = z.object({ select: WatchPriceSelectObjectSchema.optional(), include: WatchPriceIncludeObjectSchema.optional(), data: z.union([WatchPriceUpdateInputObjectSchema, WatchPriceUncheckedUpdateInputObjectSchema]), where: WatchPriceWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WatchPriceUpdateArgs>;

export const WatchPriceUpdateOneZodSchema = z.object({ select: WatchPriceSelectObjectSchema.optional(), include: WatchPriceIncludeObjectSchema.optional(), data: z.union([WatchPriceUpdateInputObjectSchema, WatchPriceUncheckedUpdateInputObjectSchema]), where: WatchPriceWhereUniqueInputObjectSchema }).strict();