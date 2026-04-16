import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchPriceSelectObjectSchema as WatchPriceSelectObjectSchema } from './objects/WatchPriceSelect.schema';
import { WatchPriceIncludeObjectSchema as WatchPriceIncludeObjectSchema } from './objects/WatchPriceInclude.schema';
import { WatchPriceWhereUniqueInputObjectSchema as WatchPriceWhereUniqueInputObjectSchema } from './objects/WatchPriceWhereUniqueInput.schema';

export const WatchPriceDeleteOneSchema: z.ZodType<Prisma.WatchPriceDeleteArgs> = z.object({ select: WatchPriceSelectObjectSchema.optional(), include: WatchPriceIncludeObjectSchema.optional(), where: WatchPriceWhereUniqueInputObjectSchema }).strict() as unknown as z.ZodType<Prisma.WatchPriceDeleteArgs>;

export const WatchPriceDeleteOneZodSchema = z.object({ select: WatchPriceSelectObjectSchema.optional(), include: WatchPriceIncludeObjectSchema.optional(), where: WatchPriceWhereUniqueInputObjectSchema }).strict();