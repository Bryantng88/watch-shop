import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchPriceSelectObjectSchema as WatchPriceSelectObjectSchema } from './objects/WatchPriceSelect.schema';
import { WatchPriceIncludeObjectSchema as WatchPriceIncludeObjectSchema } from './objects/WatchPriceInclude.schema';
import { WatchPriceCreateInputObjectSchema as WatchPriceCreateInputObjectSchema } from './objects/WatchPriceCreateInput.schema';
import { WatchPriceUncheckedCreateInputObjectSchema as WatchPriceUncheckedCreateInputObjectSchema } from './objects/WatchPriceUncheckedCreateInput.schema';

export const WatchPriceCreateOneSchema: z.ZodType<Prisma.WatchPriceCreateArgs> = z.object({ select: WatchPriceSelectObjectSchema.optional(), include: WatchPriceIncludeObjectSchema.optional(), data: z.union([WatchPriceCreateInputObjectSchema, WatchPriceUncheckedCreateInputObjectSchema]) }).strict() as unknown as z.ZodType<Prisma.WatchPriceCreateArgs>;

export const WatchPriceCreateOneZodSchema = z.object({ select: WatchPriceSelectObjectSchema.optional(), include: WatchPriceIncludeObjectSchema.optional(), data: z.union([WatchPriceCreateInputObjectSchema, WatchPriceUncheckedCreateInputObjectSchema]) }).strict();