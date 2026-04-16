import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchContentSelectObjectSchema as WatchContentSelectObjectSchema } from './objects/WatchContentSelect.schema';
import { WatchContentIncludeObjectSchema as WatchContentIncludeObjectSchema } from './objects/WatchContentInclude.schema';
import { WatchContentWhereUniqueInputObjectSchema as WatchContentWhereUniqueInputObjectSchema } from './objects/WatchContentWhereUniqueInput.schema';
import { WatchContentCreateInputObjectSchema as WatchContentCreateInputObjectSchema } from './objects/WatchContentCreateInput.schema';
import { WatchContentUncheckedCreateInputObjectSchema as WatchContentUncheckedCreateInputObjectSchema } from './objects/WatchContentUncheckedCreateInput.schema';
import { WatchContentUpdateInputObjectSchema as WatchContentUpdateInputObjectSchema } from './objects/WatchContentUpdateInput.schema';
import { WatchContentUncheckedUpdateInputObjectSchema as WatchContentUncheckedUpdateInputObjectSchema } from './objects/WatchContentUncheckedUpdateInput.schema';

export const WatchContentUpsertOneSchema: z.ZodType<Prisma.WatchContentUpsertArgs> = z.object({ select: WatchContentSelectObjectSchema.optional(), include: WatchContentIncludeObjectSchema.optional(), where: WatchContentWhereUniqueInputObjectSchema, create: z.union([ WatchContentCreateInputObjectSchema, WatchContentUncheckedCreateInputObjectSchema ]), update: z.union([ WatchContentUpdateInputObjectSchema, WatchContentUncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.WatchContentUpsertArgs>;

export const WatchContentUpsertOneZodSchema = z.object({ select: WatchContentSelectObjectSchema.optional(), include: WatchContentIncludeObjectSchema.optional(), where: WatchContentWhereUniqueInputObjectSchema, create: z.union([ WatchContentCreateInputObjectSchema, WatchContentUncheckedCreateInputObjectSchema ]), update: z.union([ WatchContentUpdateInputObjectSchema, WatchContentUncheckedUpdateInputObjectSchema ]) }).strict();