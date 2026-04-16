import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchMediaSelectObjectSchema as WatchMediaSelectObjectSchema } from './objects/WatchMediaSelect.schema';
import { WatchMediaIncludeObjectSchema as WatchMediaIncludeObjectSchema } from './objects/WatchMediaInclude.schema';
import { WatchMediaWhereUniqueInputObjectSchema as WatchMediaWhereUniqueInputObjectSchema } from './objects/WatchMediaWhereUniqueInput.schema';
import { WatchMediaCreateInputObjectSchema as WatchMediaCreateInputObjectSchema } from './objects/WatchMediaCreateInput.schema';
import { WatchMediaUncheckedCreateInputObjectSchema as WatchMediaUncheckedCreateInputObjectSchema } from './objects/WatchMediaUncheckedCreateInput.schema';
import { WatchMediaUpdateInputObjectSchema as WatchMediaUpdateInputObjectSchema } from './objects/WatchMediaUpdateInput.schema';
import { WatchMediaUncheckedUpdateInputObjectSchema as WatchMediaUncheckedUpdateInputObjectSchema } from './objects/WatchMediaUncheckedUpdateInput.schema';

export const WatchMediaUpsertOneSchema: z.ZodType<Prisma.WatchMediaUpsertArgs> = z.object({ select: WatchMediaSelectObjectSchema.optional(), include: WatchMediaIncludeObjectSchema.optional(), where: WatchMediaWhereUniqueInputObjectSchema, create: z.union([ WatchMediaCreateInputObjectSchema, WatchMediaUncheckedCreateInputObjectSchema ]), update: z.union([ WatchMediaUpdateInputObjectSchema, WatchMediaUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.WatchMediaUpsertArgs>;

export const WatchMediaUpsertOneZodSchema = z.object({ select: WatchMediaSelectObjectSchema.optional(), include: WatchMediaIncludeObjectSchema.optional(), where: WatchMediaWhereUniqueInputObjectSchema, create: z.union([ WatchMediaCreateInputObjectSchema, WatchMediaUncheckedCreateInputObjectSchema ]), update: z.union([ WatchMediaUpdateInputObjectSchema, WatchMediaUncheckedUpdateInputObjectSchema ]) }).strict();