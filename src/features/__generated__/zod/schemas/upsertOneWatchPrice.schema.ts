import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchPriceSelectObjectSchema as WatchPriceSelectObjectSchema } from './objects/WatchPriceSelect.schema';
import { WatchPriceIncludeObjectSchema as WatchPriceIncludeObjectSchema } from './objects/WatchPriceInclude.schema';
import { WatchPriceWhereUniqueInputObjectSchema as WatchPriceWhereUniqueInputObjectSchema } from './objects/WatchPriceWhereUniqueInput.schema';
import { WatchPriceCreateInputObjectSchema as WatchPriceCreateInputObjectSchema } from './objects/WatchPriceCreateInput.schema';
import { WatchPriceUncheckedCreateInputObjectSchema as WatchPriceUncheckedCreateInputObjectSchema } from './objects/WatchPriceUncheckedCreateInput.schema';
import { WatchPriceUpdateInputObjectSchema as WatchPriceUpdateInputObjectSchema } from './objects/WatchPriceUpdateInput.schema';
import { WatchPriceUncheckedUpdateInputObjectSchema as WatchPriceUncheckedUpdateInputObjectSchema } from './objects/WatchPriceUncheckedUpdateInput.schema';

export const WatchPriceUpsertOneSchema: z.ZodType<Prisma.WatchPriceUpsertArgs> = z.object({ select: WatchPriceSelectObjectSchema.optional(), include: WatchPriceIncludeObjectSchema.optional(), where: WatchPriceWhereUniqueInputObjectSchema, create: z.union([ WatchPriceCreateInputObjectSchema, WatchPriceUncheckedCreateInputObjectSchema ]), update: z.union([ WatchPriceUpdateInputObjectSchema, WatchPriceUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.WatchPriceUpsertArgs>;

export const WatchPriceUpsertOneZodSchema = z.object({ select: WatchPriceSelectObjectSchema.optional(), include: WatchPriceIncludeObjectSchema.optional(), where: WatchPriceWhereUniqueInputObjectSchema, create: z.union([ WatchPriceCreateInputObjectSchema, WatchPriceUncheckedCreateInputObjectSchema ]), update: z.union([ WatchPriceUpdateInputObjectSchema, WatchPriceUncheckedUpdateInputObjectSchema ]) }).strict();