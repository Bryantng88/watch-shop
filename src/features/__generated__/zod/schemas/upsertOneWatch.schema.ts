import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSelectObjectSchema as WatchSelectObjectSchema } from './objects/WatchSelect.schema';
import { WatchIncludeObjectSchema as WatchIncludeObjectSchema } from './objects/WatchInclude.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './objects/WatchWhereUniqueInput.schema';
import { WatchCreateInputObjectSchema as WatchCreateInputObjectSchema } from './objects/WatchCreateInput.schema';
import { WatchUncheckedCreateInputObjectSchema as WatchUncheckedCreateInputObjectSchema } from './objects/WatchUncheckedCreateInput.schema';
import { WatchUpdateInputObjectSchema as WatchUpdateInputObjectSchema } from './objects/WatchUpdateInput.schema';
import { WatchUncheckedUpdateInputObjectSchema as WatchUncheckedUpdateInputObjectSchema } from './objects/WatchUncheckedUpdateInput.schema';

export const WatchUpsertOneSchema: z.ZodType<Prisma.WatchUpsertArgs> = z.object({ select: WatchSelectObjectSchema.optional(), include: WatchIncludeObjectSchema.optional(), where: WatchWhereUniqueInputObjectSchema, create: z.union([ WatchCreateInputObjectSchema, WatchUncheckedCreateInputObjectSchema ]), update: z.union([ WatchUpdateInputObjectSchema, WatchUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.WatchUpsertArgs>;

export const WatchUpsertOneZodSchema = z.object({ select: WatchSelectObjectSchema.optional(), include: WatchIncludeObjectSchema.optional(), where: WatchWhereUniqueInputObjectSchema, create: z.union([ WatchCreateInputObjectSchema, WatchUncheckedCreateInputObjectSchema ]), update: z.union([ WatchUpdateInputObjectSchema, WatchUncheckedUpdateInputObjectSchema ]) }).strict();