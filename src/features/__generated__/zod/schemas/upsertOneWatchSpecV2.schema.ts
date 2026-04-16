import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSpecV2SelectObjectSchema as WatchSpecV2SelectObjectSchema } from './objects/WatchSpecV2Select.schema';
import { WatchSpecV2IncludeObjectSchema as WatchSpecV2IncludeObjectSchema } from './objects/WatchSpecV2Include.schema';
import { WatchSpecV2WhereUniqueInputObjectSchema as WatchSpecV2WhereUniqueInputObjectSchema } from './objects/WatchSpecV2WhereUniqueInput.schema';
import { WatchSpecV2CreateInputObjectSchema as WatchSpecV2CreateInputObjectSchema } from './objects/WatchSpecV2CreateInput.schema';
import { WatchSpecV2UncheckedCreateInputObjectSchema as WatchSpecV2UncheckedCreateInputObjectSchema } from './objects/WatchSpecV2UncheckedCreateInput.schema';
import { WatchSpecV2UpdateInputObjectSchema as WatchSpecV2UpdateInputObjectSchema } from './objects/WatchSpecV2UpdateInput.schema';
import { WatchSpecV2UncheckedUpdateInputObjectSchema as WatchSpecV2UncheckedUpdateInputObjectSchema } from './objects/WatchSpecV2UncheckedUpdateInput.schema';

export const WatchSpecV2UpsertOneSchema: z.ZodType<Prisma.WatchSpecV2UpsertArgs> = z.object({ select: WatchSpecV2SelectObjectSchema.optional(), include: WatchSpecV2IncludeObjectSchema.optional(), where: WatchSpecV2WhereUniqueInputObjectSchema, create: z.union([ WatchSpecV2CreateInputObjectSchema, WatchSpecV2UncheckedCreateInputObjectSchema ]), update: z.union([ WatchSpecV2UpdateInputObjectSchema, WatchSpecV2UncheckedUpdateInputObjectSchema ]) }).strict() as unknown as z.ZodType<Prisma.WatchSpecV2UpsertArgs>;

export const WatchSpecV2UpsertOneZodSchema = z.object({ select: WatchSpecV2SelectObjectSchema.optional(), include: WatchSpecV2IncludeObjectSchema.optional(), where: WatchSpecV2WhereUniqueInputObjectSchema, create: z.union([ WatchSpecV2CreateInputObjectSchema, WatchSpecV2UncheckedCreateInputObjectSchema ]), update: z.union([ WatchSpecV2UpdateInputObjectSchema, WatchSpecV2UncheckedUpdateInputObjectSchema ]) }).strict();