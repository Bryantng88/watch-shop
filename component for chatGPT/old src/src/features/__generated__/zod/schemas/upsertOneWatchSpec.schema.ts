import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSpecSelectObjectSchema as WatchSpecSelectObjectSchema } from './objects/WatchSpecSelect.schema';
import { WatchSpecIncludeObjectSchema as WatchSpecIncludeObjectSchema } from './objects/WatchSpecInclude.schema';
import { WatchSpecWhereUniqueInputObjectSchema as WatchSpecWhereUniqueInputObjectSchema } from './objects/WatchSpecWhereUniqueInput.schema';
import { WatchSpecCreateInputObjectSchema as WatchSpecCreateInputObjectSchema } from './objects/WatchSpecCreateInput.schema';
import { WatchSpecUncheckedCreateInputObjectSchema as WatchSpecUncheckedCreateInputObjectSchema } from './objects/WatchSpecUncheckedCreateInput.schema';
import { WatchSpecUpdateInputObjectSchema as WatchSpecUpdateInputObjectSchema } from './objects/WatchSpecUpdateInput.schema';
import { WatchSpecUncheckedUpdateInputObjectSchema as WatchSpecUncheckedUpdateInputObjectSchema } from './objects/WatchSpecUncheckedUpdateInput.schema';

export const WatchSpecUpsertOneSchema: z.ZodType<Prisma.WatchSpecUpsertArgs> = z.object({ select: WatchSpecSelectObjectSchema.optional(), include: WatchSpecIncludeObjectSchema.optional(), where: WatchSpecWhereUniqueInputObjectSchema, create: z.union([ WatchSpecCreateInputObjectSchema, WatchSpecUncheckedCreateInputObjectSchema ]), update: z.union([ WatchSpecUpdateInputObjectSchema, WatchSpecUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.WatchSpecUpsertArgs>;

export const WatchSpecUpsertOneZodSchema = z.object({ select: WatchSpecSelectObjectSchema.optional(), include: WatchSpecIncludeObjectSchema.optional(), where: WatchSpecWhereUniqueInputObjectSchema, create: z.union([ WatchSpecCreateInputObjectSchema, WatchSpecUncheckedCreateInputObjectSchema ]), update: z.union([ WatchSpecUpdateInputObjectSchema, WatchSpecUncheckedUpdateInputObjectSchema ]) }).strict();